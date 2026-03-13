const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const XLSX = require('xlsx');
const dotenv = require('dotenv');

dotenv.config();

const normalize = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const config = {
  baseUrl: process.env.SYNC_BASE_URL || 'https://live.nirvanaxp.com',
  username: process.env.SYNC_USERNAME || process.env.NXP_USERNAME,
  password: process.env.SYNC_PASSWORD || process.env.NXP_PASSWORD,
  excelPath: process.env.SYNC_EXCEL_PATH || 'C:\\Users\\Admin\\Downloads\\La Boulangerie_50 items.xlsx',
  sheetName: process.env.SYNC_SHEET_NAME || '',
  sourceLocationId: process.env.SYNC_SOURCE_LOCATION_ID || '1',
  sourceLocationName: process.env.SYNC_SOURCE_LOCATION || 'La Boulangerie',
  targetLocationId: process.env.SYNC_TARGET_LOCATION_ID || '66',
  targetLocationName: process.env.SYNC_TARGET_LOCATION || 'La Boulangerie 1',
  offset: Number.parseInt(process.env.SYNC_OFFSET || '0', 10),
  limit: Number.parseInt(process.env.SYNC_LIMIT || '50', 10),
  headless: process.env.SYNC_HEADLESS !== 'false',
  commit: process.env.SYNC_COMMIT === 'true',
  reportDir: path.resolve(process.cwd(), 'reports'),
};

const TARGET_LOCATION_FIELD = 'locationId';

const CHECKBOX_IDS_TO_COPY = [
  'inclusivePrice',
  'isOnlineDisplay',
  'isOnlineItem',
  'inventoryAccrual_item',
  'isScanRequired',
  'isManualQuantity',
  'isManualPrice',
  'isWeighingMachine',
  'isRealTimeUpdateNeeded',
  'availability',
  'showCouponCodePopup',
  'thirdPartyPlatform',
  'status',
  'taxexempt',
  'isTempControl',
  'isFixedBuffetMenu',
];

const TEXT_INPUT_IDS_TO_COPY = [
  'name',
  'displayName',
  'shortName',
  'price',
  'mrp',
  'icon_color',
  'fromTime',
  'toTime',
  'update_date',
  'pluNumber',
  'incentive',
  'minTemp',
  'maxTemp',
];

const TEXTAREA_IDS_TO_COPY = [
  'description',
  'labelIngredients',
  'contains',
  'instruction',
];

const SELECT_IDS_TO_COPY = [
  'salesTax',
  'discount',
  'course',
  'new_category_id',
  'item_attr',
  'item_char',
  'itemGroupId',
  'itemType',
  'nutrition',
  'leadDay',
  'leadHr',
  'leadMin',
  'cutOffDay',
  'cutOffHr',
  'cutOffMin',
  'storageTypeId',
  'discountTypeId',
];

const HIDDEN_IDS_TO_COPY = [
  'globalItemId',
  'yieldPercent',
  'purchasingRate',
  'distributionPrice',
  'displaySequence',
  'itemNumber',
  'account_logo',
  'filename',
];

function ensureConfig() {
  if (!config.username || !config.password) {
    throw new Error('Set SYNC_USERNAME/SYNC_PASSWORD or NXP_USERNAME/NXP_PASSWORD before running the sync.');
  }

  if (!fs.existsSync(config.excelPath)) {
    throw new Error(`Excel file not found: ${config.excelPath}`);
  }

  if (!Number.isFinite(config.limit) || config.limit <= 0) {
    throw new Error(`SYNC_LIMIT must be a positive integer. Received: ${config.limit}`);
  }

  if (!Number.isFinite(config.offset) || config.offset < 0) {
    throw new Error(`SYNC_OFFSET must be zero or a positive integer. Received: ${config.offset}`);
  }

  fs.mkdirSync(config.reportDir, { recursive: true });
}

function readExcelItems() {
  const workbook = XLSX.readFile(config.excelPath);
  const firstSheetName = config.sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  if (!sheet) {
    throw new Error(`Sheet not found: ${firstSheetName}`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const items = [];
  const seen = new Set();

  rows.forEach((row, index) => {
    const category = String(row.Category || row.category || row.name_1 || row['Category Name'] || '').trim();
    const itemName = String(row['Item Name'] || row.itemName || row.name || row['ItemName'] || '').trim();

    if (!category || !itemName) {
      return;
    }

    const key = `${normalize(category)}::${normalize(itemName)}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push({
      excelRow: index + 2,
      category,
      itemName,
      key,
    });
  });

  return items.slice(config.offset, config.offset + config.limit);
}

async function login(page) {
  await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('#username').fill(config.username);
  await page.locator('#password').fill(config.password);
  await Promise.all([
    page.waitForFunction(() => window.location.pathname !== '/' && !document.querySelector('#login'), {
      timeout: 60000,
    }),
    page.locator('#login').click(),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
}

async function verifyLocation(page) {
  await page.goto(`${config.baseUrl}/globalItem/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

  const options = await page.locator('#locationsId option').evaluateAll((nodes) =>
    nodes.map((node) => ({
      value: node.value,
      text: (node.textContent || '').trim(),
    }))
  );

  const target = options.find((option) => option.value === config.targetLocationId);
  if (!target) {
    throw new Error(
      `Target location ${config.targetLocationName} (${config.targetLocationId}) not found. Available locations: ${options
        .map((option) => `${option.text} [${option.value}]`)
        .join(', ')}`
    );
  }
}

async function searchItems(page, locationId, itemName) {
  const searchUrl = `${config.baseUrl}/globalItem/?locationsId=${encodeURIComponent(locationId)}&itemName=${encodeURIComponent(itemName)}&limit=100`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

  return page.locator('tr').evaluateAll((rows) =>
    rows
      .map((row) => {
        const updateButton = row.querySelector('input.update_item');
        if (!updateButton) {
          return null;
        }

        const cells = Array.from(row.querySelectorAll('td')).map((td) =>
          (td.innerText || '').trim().replace(/\s+/g, ' ')
        );

        return {
          itemId: updateButton.getAttribute('lang') || '',
          cells,
        };
      })
      .filter(Boolean)
  );
}

function findBestSourceMatch(item, rows) {
  const exactMatches = rows.filter((row) => {
    const itemName = normalize(row.cells[1]);
    const category = normalize(row.cells[3]);
    return itemName === normalize(item.itemName) && category === normalize(item.category);
  });

  if (exactMatches.length > 0) {
    return {
      match: exactMatches[0],
      duplicateCount: exactMatches.length,
    };
  }

  const closeMatches = rows.filter((row) => normalize(row.cells[3]) === normalize(item.category));
  return {
    match: null,
    duplicateCount: 0,
    closeMatches: closeMatches.slice(0, 10).map((row) => ({
      itemId: row.itemId,
      itemName: row.cells[1],
      category: row.cells[3],
      course: row.cells[2],
    })),
  };
}

async function openItemModal(page, itemId) {
  const button = page.locator(`input.update_item[lang="${itemId}"]`).first();
  await button.click();
  await page.locator('#item_form').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(500);
}

async function closeItemModal(page) {
  const closeButton = page.locator('#back').first();
  if (await closeButton.count()) {
    await closeButton.click();
    await page.waitForTimeout(500);
    return;
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);
}

async function extractSourceData(page) {
  return page.evaluate(
    ({
      checkboxIds,
      textInputIds,
      textareaIds,
      selectIds,
      hiddenIds,
    }) => {
      const readValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value ?? '' : '';
      };

      const readChecked = (id) => {
        const element = document.getElementById(id);
        return element ? !!element.checked : false;
      };

      const readSelectedTexts = (id) => {
        const element = document.getElementById(id);
        if (!element) {
          return [];
        }

        return Array.from(element.selectedOptions || []).map((option) =>
          (option.textContent || '').replace(/\s+/g, ' ').trim()
        );
      };

      const data = {
        inputs: {},
        textareas: {},
        checkboxes: {},
        selects: {},
        hidden: {},
      };

      textInputIds.forEach((id) => {
        data.inputs[id] = readValue(id);
      });

      textareaIds.forEach((id) => {
        data.textareas[id] = readValue(id);
      });

      checkboxIds.forEach((id) => {
        data.checkboxes[id] = readChecked(id);
      });

      selectIds.forEach((id) => {
        data.selects[id] = readSelectedTexts(id);
      });

      hiddenIds.forEach((id) => {
        data.hidden[id] = readValue(id);
      });

      return data;
    },
    {
      checkboxIds: CHECKBOX_IDS_TO_COPY,
      textInputIds: TEXT_INPUT_IDS_TO_COPY,
      textareaIds: TEXTAREA_IDS_TO_COPY,
      selectIds: SELECT_IDS_TO_COPY,
      hiddenIds: HIDDEN_IDS_TO_COPY,
    }
  );
}

async function openTargetAddModal(page, itemName) {
  const targetUrl = `${config.baseUrl}/globalItem/?locationsId=${encodeURIComponent(config.targetLocationId)}&itemName=${encodeURIComponent(itemName)}&limit=100`;
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await page.locator('.add_btn').click();
  await page.locator('#item_form').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(500);
}

async function resolveTargetCategoryId(page, categoryName) {
  const categoryUrl = `${config.baseUrl}/globalCategory?locationsId=${encodeURIComponent(config.targetLocationId)}&categoryName=${encodeURIComponent(categoryName)}&limit=10`;
  await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

  const rows = await page.locator('tr').evaluateAll((rows) =>
    rows
      .map((row) => {
        const updateButton = row.querySelector('input.update_category');
        if (!updateButton) {
          return null;
        }

        const cells = Array.from(row.querySelectorAll('td')).map((td) =>
          (td.innerText || '').trim().replace(/\s+/g, ' ')
        );

        return {
          categoryId: updateButton.getAttribute('lang') || '',
          cells,
        };
      })
      .filter(Boolean)
  );

  const exact = rows.find((row) => normalize(row.cells[0]) === normalize(categoryName));
  return exact ? { id: exact.categoryId, text: rowText(rowValue(exact.cells, 0)) } : null;
}

function rowValue(cells, index) {
  return Array.isArray(cells) ? cells[index] || '' : '';
}

function rowText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function targetAlreadyExists(page, item) {
  const rows = await searchItems(page, config.targetLocationId, item.itemName);
  const exactMatches = rows.filter((row) => {
    const itemName = normalize(row.cells[1]);
    const category = normalize(row.cells[3]);
    return itemName === normalize(item.itemName) && category === normalize(item.category);
  });

  return {
    exists: exactMatches.length > 0,
    rows: exactMatches,
  };
}

async function applySourceDataToTarget(page, sourceData, categoryOverride) {
  return page.evaluate(
    ({ sourceData, targetLocationId, targetLocationName, categoryOverride }) => {
      const missing = [];

      const normalizeText = (value) => String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      const dispatch = (element) => {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const setValue = (id, value) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        element.value = value ?? '';
        dispatch(element);
      };

      const setChecked = (id, checked) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        element.checked = !!checked;
        dispatch(element);
      };

      const setSelectByTexts = (id, texts) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        const wanted = (texts || [])
          .map((text) => normalizeText(text))
          .filter(Boolean);

        if (wanted.length === 0) {
          Array.from(element.options).forEach((option) => {
            option.selected = false;
          });
          dispatch(element);
          return;
        }

        const matched = [];
        Array.from(element.options).forEach((option) => {
          const optionText = normalizeText(option.textContent || option.label || option.value);
          const shouldSelect = wanted.includes(optionText);
          option.selected = shouldSelect;
          if (shouldSelect) {
            matched.push(optionText);
          }
        });

        wanted.forEach((text) => {
          if (!matched.includes(text)) {
            missing.push(`${id}: ${text}`);
          }
        });

        dispatch(element);
      };

      const setLocation = () => {
        const element = document.getElementById('locationId');
        if (!element) {
          missing.push(`locationId: ${targetLocationName}`);
          return;
        }

        let found = false;
        Array.from(element.options).forEach((option) => {
          const shouldSelect = option.value === targetLocationId;
          option.selected = shouldSelect;
          if (shouldSelect) {
            found = true;
          }
        });

        if (!found) {
          missing.push(`locationId: ${targetLocationName}`);
        }

        dispatch(element);
      };

      setLocation();

      if (categoryOverride) {
        const categorySelect = document.getElementById('new_category_id');
        if (categorySelect) {
          const wantedText = normalizeText(categoryOverride.text);
          const hasOption = Array.from(categorySelect.options).some(
            (option) => normalizeText(option.textContent || option.label || option.value) === wantedText
          );

          if (!hasOption) {
            const option = new Option(categoryOverride.text, categoryOverride.id);
            categorySelect.add(option);
            dispatch(categorySelect);
          }
        }
      }

      Object.entries(sourceData.inputs || {}).forEach(([id, value]) => setValue(id, value));
      Object.entries(sourceData.textareas || {}).forEach(([id, value]) => setValue(id, value));
      Object.entries(sourceData.hidden || {}).forEach(([id, value]) => setValue(id, value));
      Object.entries(sourceData.checkboxes || {}).forEach(([id, checked]) => setChecked(id, checked));
      Object.entries(sourceData.selects || {}).forEach(([id, texts]) => setSelectByTexts(id, texts));

      return missing;
    },
    {
      sourceData,
      targetLocationId: config.targetLocationId,
      targetLocationName: config.targetLocationName,
      categoryOverride,
    }
  );
}

async function createTargetItem(page) {
  const createButton = page.locator('.add_global_item', { hasText: 'Create' }).first();
  await Promise.all([
    page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {}),
    createButton.click(),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function run() {
  ensureConfig();
  const items = readExcelItems();
  const browser = await chromium.launch({ headless: config.headless });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  const dialogs = [];

  page.on('dialog', async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.accept().catch(() => {});
  });

  const summary = {
    config: {
      baseUrl: config.baseUrl,
      excelPath: config.excelPath,
      sourceLocationId: config.sourceLocationId,
      sourceLocationName: config.sourceLocationName,
      targetLocationId: config.targetLocationId,
      targetLocationName: config.targetLocationName,
      offset: config.offset,
      limit: items.length,
      commit: config.commit,
    },
    generatedAt: new Date().toISOString(),
    items: [],
  };
  const categoryIdCache = new Map();

  try {
    await login(page);
    await verifyLocation(page);

    for (const item of items) {
      const result = {
        excelRow: item.excelRow,
        itemName: item.itemName,
        category: item.category,
        status: 'pending',
        details: '',
      };

      try {
        const existingTarget = await targetAlreadyExists(page, item);
        if (existingTarget.exists) {
          result.status = 'already_exists';
          result.details = `Found ${existingTarget.rows.length} existing target match(es).`;
          summary.items.push(result);
          continue;
        }

        const sourceRows = await searchItems(page, config.sourceLocationId, item.itemName);
        const sourceMatch = findBestSourceMatch(item, sourceRows);

        if (!sourceMatch.match) {
          result.status = 'source_not_found';
          result.details = sourceMatch.closeMatches && sourceMatch.closeMatches.length
            ? `Exact source item not found. Closest category matches: ${JSON.stringify(sourceMatch.closeMatches)}`
            : 'Exact source item not found.';
          summary.items.push(result);
          continue;
        }

        await openItemModal(page, sourceMatch.match.itemId);
        const sourceData = await extractSourceData(page);
        await closeItemModal(page);

        let categoryOverride = null;
        const categoryKey = normalize(item.category);
        if (categoryIdCache.has(categoryKey)) {
          categoryOverride = categoryIdCache.get(categoryKey);
        } else {
          categoryOverride = await resolveTargetCategoryId(page, item.category);
          categoryIdCache.set(categoryKey, categoryOverride);
        }

        await openTargetAddModal(page, item.itemName);
        const missingTargetOptions = await applySourceDataToTarget(page, sourceData, categoryOverride);

        if (missingTargetOptions.length > 0) {
          await closeItemModal(page);
          result.status = 'target_option_missing';
          result.details = `Missing target options: ${missingTargetOptions.join('; ')}`;
          summary.items.push(result);
          continue;
        }

        if (!config.commit) {
          await closeItemModal(page);
          result.status = 'dry_run_ready';
          result.details = `Source item ${sourceMatch.match.itemId} resolved successfully.`;
          summary.items.push(result);
          continue;
        }

        await createTargetItem(page);
        const verification = await targetAlreadyExists(page, item);

        if (verification.exists) {
          result.status = 'created';
          result.details = `Created from source item ${sourceMatch.match.itemId}${sourceMatch.duplicateCount > 1 ? ` (source duplicates: ${sourceMatch.duplicateCount})` : ''}.`;
        } else {
          result.status = 'verification_failed';
          result.details = `Create submitted for source item ${sourceMatch.match.itemId}, but target item was not found afterward.`;
        }

        summary.items.push(result);
      } catch (error) {
        result.status = 'error';
        result.details = error instanceof Error ? error.message : String(error);
        summary.items.push(result);
      }
    }
  } finally {
    await browser.close();
  }

  summary.dialogs = dialogs;
  summary.counts = summary.items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const reportPath = path.join(config.reportDir, `item-sync-summary-${timestamp()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Summary saved to ${reportPath}`);
  console.log(JSON.stringify(summary.counts, null, 2));

  for (const item of summary.items) {
    console.log(`[${item.status}] ${item.category} | ${item.itemName}${item.details ? ` | ${item.details}` : ''}`);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
