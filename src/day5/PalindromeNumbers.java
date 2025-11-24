package day5;

import java.util.Scanner;

//Conditional statement and looping statement
public class PalindromeNumbers {

	public static void main(String[] args) {
		
		Scanner sc =new Scanner(System.in);
		System.out.println("Enter a Number");
		
		int num=sc.nextInt();
		
		int orinum=num;
		
		int rev=0;
		  
		 while(num!=0)
		 { 
			 rev=rev*10 + num%10;
			 num=num/10; 
	   }
		 if(orinum==rev)
		 {
			 System.out.println(orinum+" Palindrome Number");
		 }
		 else
		 {
			 System.out.println(orinum+" Not Palindrome Number");
		 }

	}

}
