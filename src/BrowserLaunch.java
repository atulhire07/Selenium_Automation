import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;


public class BrowserLaunch {

	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		
		//System.setProperty("webdriver.gecko.driver", "C:\\Users\\Admin\\eclipse-workspace\\SeleniumDemoAtul\\libs\\geckodriver.exe");
		System.setProperty("webdriver.gecko.driver", "C:\\Users\\Admin\\eclipse-workspace\\SeleniumDemoAtul\\libs\\geckodriver.exe");
		
		
	
		WebDriver driver = new FirefoxDriver();
		
		//WebDriver driver = new ChromeDriver();
		
		driver.get("https://test.nirvanaxp.com");
		
		//driver.findElement(By.id("APjFqb")).sendKeys("abcd");
		
		driver.findElement(By.xpath("//textarea[@name='q']")).sendKeys("abcd");
		
		List<WebElement> listOfInputElements = driver.findElements(By.xpath("//textarea"));
		
		
		int count = listOfInputElements.size();
		
		System.out.println("Count of Input elements : "+count);
		
		//WebElement textBox = driver.findElement(By.id("APjFqb")).sendKeys("abcd");
		
		// textBox.sendKeys("Automation step by step");
		
		Thread.sleep(3000);
		
		driver.close();
		
		
	}
	

}
