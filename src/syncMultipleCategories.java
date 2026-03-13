import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class syncMultipleCategories {

    WebDriver driver;

    public void setup() {

        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();

        driver.get("https://live.nirvanaxp.com");
    }

    // LOGIN
    public void login() {

        driver.findElement(By.id("username")).sendKeys("laboulangerie");
        driver.findElement(By.id("password")).sendKeys("livefsr@1");

        driver.findElement(By.id("login")).click();
    }

    // OPEN GLOBAL PRODUCT SETTINGS
    public void openGlobalProductSettings() {

        driver.findElement(By.xpath("//*[@id='content']/div/table/tbody/tr[2]/td[5]")).click();
    }

    // SYNC ALL CATEGORIES
    public void syncAllCategories(String newLocation) throws InterruptedException {

        List<WebElement> rows = driver.findElements(By.xpath("//*[@id='panel']/table/tbody/tr"));

        int totalRows = rows.size();

        System.out.println("Total categories found: " + totalRows);

        for (int i = 2; i <= totalRows; i++) {

            try {

                // Click More button
                driver.findElement(By.xpath("//*[@id='panel']/table/tbody/tr[" + i + "]/td[5]/input")).click();

                Thread.sleep(1000);

                // Open location dropdown
                driver.findElement(By.xpath("//button[contains(@class,'multiselect')]")).click();

                List<WebElement> locations = driver.findElements(
                        By.xpath("//ul[contains(@class,'multiselect-container')]//label"));

                for (WebElement loc : locations) {

                    if (loc.getText().contains(newLocation)) {

                        loc.click();
                        break;
                    }
                }

                Thread.sleep(1000);

                // Click Update
                driver.findElement(By.id("update_global_category")).click();

                System.out.println("Category synced for row: " + i);

                Thread.sleep(2000);

            } catch (Exception e) {

                System.out.println("Error syncing row: " + i);
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {

        syncMultipleCategories test = new syncMultipleCategories();

        test.setup();

        test.login();

        Thread.sleep(3000);

        test.openGlobalProductSettings();

        Thread.sleep(3000);

        test.syncAllCategories("La Boulangerie 2");
    }
}