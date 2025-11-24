package day5;

public class WhileLoop {

	public static void main(String[] args) {
		
		//Example 1 --- 1 to 10 numbers
		
		/*
		 * int i=1; // initialization
		 * 
		 * while(i<=10) //Condition { System.out.println(i); i++; //incrementation
		 * 
		 * }
		 */
		
		// Example 2- priny Hello message 10 times
		
		/*
		 * int i=1;
		 * 
		 * while (i<=10) { System.out.println("Hello"); i++; }
		 */
		
		// Example 3- print even numbers between 1 to 10
		//Approach 1
		/*
		 * int i=2;
		 * 
		 * while(i<=10) { System.out.println(i); i+=2; //i=i+2; }
		 */
		
		//Approach 2- 
		
		/*
		 * int i=1;
		 * 
		 * while(i<=10) { if(i%2==0) System.out.println(i); i++; }
		 */
		
		//Example 4- 1----10
		// 1-odd, 2-even, 3-odd -----10- even
		
		/*
		 * int i=1;
		 * 
		 * while(i<=10) { if(i%2==0) { System.out.println(i+" Even"); } else {
		 * System.out.println(i+" Odd"); } i++; }
		 */
		
		//Example 5- descending order 1-----10
		
		int i=10;
		
		while(i>0)
		{
			System.out.println(i);
			i--;    //decremental
		}
	}

}
