package Udemy;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.WebDriver;

public class Intro {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		//Invoking browser
		//Chrome - ChromeDriver-> Methods
		//ChromeDriver driver=new ChromeDriver();
		
		//step to invoke chrome driver//
		//System.setProperty("webdriver.chrome.driver", "C:\\\\Users\\\\Admin\\\\eclipse-workspace\\\\SeleniumDemoAtul\\chromedriver");

		WebDriver driver = new ChromeDriver();
		driver.get("https://rahulshettyacademy.com");
		System.out.println(driver.getTitle());
		System.out.println(driver.getCurrentUrl());
		//driver.close();
		driver.quit();
	}

}
