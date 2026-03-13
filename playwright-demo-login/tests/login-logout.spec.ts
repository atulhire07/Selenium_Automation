import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('NirvanaXP login and logout', async ({ page, baseURL }) => {
  const username = process.env.NXP_USERNAME;
  const password = process.env.NXP_PASSWORD;

  if (!username || !password) {
    throw new Error('Set NXP_USERNAME and NXP_PASSWORD in .env file.');
  }

  await page.goto(baseURL || 'https://test.nirvanaxp.com', { waitUntil: 'domcontentloaded' });

  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login').click();

  await expect(page).toHaveURL(/nirvanaxp\.com/i);

  const logoutCandidates = [
    page.getByRole('link', { name: /logout/i }),
    page.getByRole('button', { name: /logout/i }),
    page.locator('a:has-text("Logout")'),
    page.locator('button:has-text("Logout")'),
    page.locator('#logout')
  ];

  let clicked = false;
  for (const candidate of logoutCandidates) {
    if (await candidate.count()) {
      await candidate.first().click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    throw new Error('Logout control not found. Update locator for your UI.');
  }

  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});
