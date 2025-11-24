package day5;

import org.seleniumhq.jetty9.util.Scanner;

// Using Looping statement
public class CountNumOfDigitsNumbers {

	public static void main(String[] args) {
		
     int num=5810;
     int count=0;
     
     while(num>0)
     {
    	 num=num/10;
    	 count++;
     }
     System.out.println("Number of digits:"+count);

	}

}
