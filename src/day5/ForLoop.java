package day5;

public class ForLoop {

	public static void main(String[] args) {
       
		//1....10 number
		
		/*
		 * for(int i=1;i<=10;i++) { System.out.println(i); }
		 */
		
		//1....10 Even numbers
		
		/*
		 * for(int i=2;i<=10;i+=2) { System.out.println(i); }
		 */
		
		
		//Example 3- 1.....10  even or odd numbers
		/* 1- odd
		 * 2- even
		 * 3- odd
		 * ---
		 * --
		 * 10- even
		 */
		/*
		 * for(int i=1;i<=10;i++) { if(i%2==0) { System.out.println(i+"Even"); } else {
		 * System.out.println(i+"Odd"); } }
		 */
		
		
		// Example 4- 10,9,----1 dec order
		
		for(int i=10;i>0;i--)
		{
			System.out.println(i);
		}
       		
       		
	}

}
