package mydemo;

import org.openqa.selenium.chrome.ChromeDriver;

public class BrowserLaunch1 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		System.setProperty("webdriver.gecko.driver", "C:\\Users\\Admin\\eclipse-workspace\\SeleniumDemoAtul\\drivers\\geckodriver\\geckodriver.exe");

	
		ChromeDriver driver = new ChromeDriver();
		
		driver.get("https://www.google.com");
		
		driver.close();
		
	}

}