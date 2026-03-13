import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CategorySyncAutomation {

    private static final String BASE_URL = "https://live.nirvanaxp.com";
    private static final String DEFAULT_CATEGORY_FILE = "C:\\Users\\Admin\\Downloads\\Category.txt";
    private static final String DEFAULT_LOCATION = "La Boulangerie 2";
    private static final String DEFAULT_MASTER_LOCATION_ID = "65";

    private WebDriver driver;
    private WebDriverWait wait;
    private Path chromeProfilePath;
    private boolean tempProfileCreated;

    public void setup() {
        String configuredProfileDir = System.getProperty("app.chrome.profileDir", "").trim();
        if (!configuredProfileDir.isEmpty()) {
            chromeProfilePath = Paths.get(configuredProfileDir);
            tempProfileCreated = false;
        } else {
            try {
                chromeProfilePath = Files.createTempDirectory("nxp-selenium-profile-");
                tempProfileCreated = true;
            } catch (IOException ex) {
                throw new RuntimeException("Unable to create temporary Chrome profile directory", ex);
            }
        }

        ChromeOptions options = new ChromeOptions();
        boolean headless = Boolean.parseBoolean(System.getProperty("app.headless", "true"));
        if (headless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--no-sandbox");
        options.addArguments("--no-first-run");
        options.addArguments("--no-default-browser-check");
        options.addArguments("--remote-debugging-pipe");
        options.addArguments("--user-data-dir=" + chromeProfilePath.toString());

        driver = new ChromeDriver(options);
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        driver.get(BASE_URL);
    }

    public void login(String username, String password) {
        System.out.println("Logging in...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.id("login")).click();
        wait.until(ExpectedConditions.urlContains("live.nirvanaxp.com"));
    }

    public void openGlobalProductSettings() {
        System.out.println("Opening Global Product Settings...");
        By globalProductSettings = By.xpath("//*[@id='content']/div/table/tbody/tr[2]/td[5]");
        wait.until(ExpectedConditions.elementToBeClickable(globalProductSettings)).click();
        wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(By.id("categoryName")),
                ExpectedConditions.visibilityOfElementLocated(By.id("panel"))));
    }

    public boolean syncCategoryToLocation(String categoryName, String locationName, String masterLocationId) {
        try {
            System.out.println("Processing category: " + categoryName);
            waitForOverlayToClear();
            openCategorySearchResults(categoryName, masterLocationId);

            By firstResultRow = By.xpath("//*[@id='panel']/table/tbody/tr[position()>1][1]");
            WebElement firstRow = wait.until(ExpectedConditions.visibilityOfElementLocated(firstResultRow));
            WebElement moreButton = firstRow.findElement(By.xpath("./td[5]/input"));
            wait.until(ExpectedConditions.elementToBeClickable(moreButton)).click();

            WebElement locationSelectElement = wait
                    .until(ExpectedConditions.presenceOfElementLocated(By.id("locationId")));
            wait.until(driver -> !driver.findElements(By.cssSelector("#locationId option")).isEmpty());
            boolean locationMatched = selectLocation(locationSelectElement, locationName);

            if (!locationMatched) {
                System.out.println("Location not found for category: " + categoryName + " -> " + locationName);
                return false;
            }

            WebElement updateButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("update_global_category")));
            updateButton.click();
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.stalenessOf(updateButton),
                    ExpectedConditions.invisibilityOfElementLocated(By.id("mask")),
                    ExpectedConditions.visibilityOfElementLocated(By.id("panel"))));
            return true;
        } catch (TimeoutException ex) {
            saveDebugPage("timeout-" + sanitizeName(categoryName));
            System.out.println("Category not synced (timeout): " + categoryName + " | URL: " + driver.getCurrentUrl());
            return false;
        } catch (Exception ex) {
            System.out.println("Category not synced: " + categoryName + " | " + ex.getMessage());
            return false;
        } finally {
            dismissOverlayIfPresent();
        }
    }

    private void openCategorySearchResults(String categoryName, String masterLocationId) {
        String encodedCategory = URLEncoder.encode(categoryName, StandardCharsets.UTF_8);
        String encodedLocationId = URLEncoder.encode(masterLocationId, StandardCharsets.UTF_8);
        String searchUrl = BASE_URL + "/globalCategory?locationsId=" + encodedLocationId
                + "&categoryName=" + encodedCategory + "&limit=10";
        driver.get(searchUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("panel")));
    }

    private void waitForOverlayToClear() {
        wait.until(driver -> {
            List<WebElement> masks = driver.findElements(By.id("mask"));
            return masks.isEmpty() || !masks.get(0).isDisplayed();
        });
    }

    private void dismissOverlayIfPresent() {
        try {
            List<WebElement> masks = driver.findElements(By.id("mask"));
            if (masks.isEmpty() || !masks.get(0).isDisplayed()) {
                return;
            }

            List<WebElement> closeButtons = driver.findElements(By.id("back"));
            if (!closeButtons.isEmpty() && closeButtons.get(0).isDisplayed()) {
                closeButtons.get(0).click();
            } else {
                ((JavascriptExecutor) driver).executeScript(
                        "if (window.jQuery) {" +
                                "  jQuery('#login-box').html('');" +
                                "  jQuery('#mask').hide();" +
                                "} else {" +
                                "  var m = document.getElementById('mask'); if (m) m.style.display='none';" +
                                "  var l = document.getElementById('login-box'); if (l) l.innerHTML='';" +
                                "}");
            }

            new WebDriverWait(driver, Duration.ofSeconds(5)).until(d -> {
                List<WebElement> activeMasks = d.findElements(By.id("mask"));
                return activeMasks.isEmpty() || !activeMasks.get(0).isDisplayed();
            });
        } catch (Exception ignore) {
            // Best-effort unblock only.
        }
    }

    private boolean selectLocation(WebElement locationSelectElement, String locationName) {
        String target = locationName == null ? "" : locationName.trim().toLowerCase();
        Object matched = ((JavascriptExecutor) driver).executeScript(
                "const select = arguments[0];" +
                        "const target = arguments[1];" +
                        "let found = false;" +
                        "for (const option of select.options) {" +
                        "  const text = (option.textContent || '').trim().toLowerCase();" +
                        "  if (text === target || text.startsWith(target + ' ') || text.includes(target)) {" +
                        "    option.selected = true;" +
                        "    found = true;" +
                        "  }" +
                        "}" +
                        "if (found) {" +
                        "  select.dispatchEvent(new Event('change', { bubbles: true }));" +
                        "}" +
                        "return found;",
                locationSelectElement, target);
        return Boolean.TRUE.equals(matched);
    }

    public void close() {
        if (driver != null) {
            driver.quit();
        }
        if (tempProfileCreated && chromeProfilePath != null) {
            try (var walk = Files.walk(chromeProfilePath)) {
                walk.sorted((a, b) -> b.compareTo(a)).forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException ignore) {
                        // Best-effort cleanup only.
                    }
                });
            } catch (IOException ignore) {
                // Best-effort cleanup only.
            }
        }
    }

    public static List<String> readCategories(Path filePath) throws IOException {
        if (!Files.exists(filePath)) {
            throw new IOException("Category file not found: " + filePath);
        }
        return Files.readAllLines(filePath, StandardCharsets.UTF_8).stream()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .collect(Collectors.toList());
    }

    private void saveDebugPage(String suffix) {
        try {
            Path debugFile = Path.of("debug-" + suffix + ".html");
            Files.writeString(debugFile, driver.getPageSource(), StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Debug page saved: " + debugFile.toAbsolutePath());
        } catch (Exception ignore) {
            // Best-effort debug dump only.
        }
    }

    private String sanitizeName(String input) {
        return input == null ? "unknown" : input.replaceAll("[^a-zA-Z0-9-_]", "_");
    }

    public static void main(String[] args) throws IOException {
        String username = System.getProperty("app.username", "laboulangerie");
        String password = System.getProperty("app.password", "livefsr@1");
        String secondLocation = System.getProperty("app.location", DEFAULT_LOCATION);
        String masterLocationId = System.getProperty("app.masterLocationId", DEFAULT_MASTER_LOCATION_ID);
        Path categoriesFile = Path.of(System.getProperty("categories.file", DEFAULT_CATEGORY_FILE));

        List<String> categories = readCategories(categoriesFile);
        if (categories.isEmpty()) {
            throw new IllegalStateException("No categories found in file: " + categoriesFile);
        }

        CategorySyncAutomation automation = new CategorySyncAutomation();
        int successCount = 0;

        try {
            automation.setup();
            automation.login(username, password);
            automation.openGlobalProductSettings();

            for (String category : categories) {
                boolean synced = automation.syncCategoryToLocation(category, secondLocation, masterLocationId);
                if (synced) {
                    successCount++;
                    System.out.println("Synced: " + category);
                } else {
                    System.out.println("Skipped/Failed: " + category);
                }
            }
        } finally {
            automation.close();
        }

        System.out.println("Completed. Synced " + successCount + " of " + categories.size() + " categories.");
    }
}
