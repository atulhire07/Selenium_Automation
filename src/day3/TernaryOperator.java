package day3;

public class TernaryOperator {

	public static void main(String[] args) 
	{
      // var=exp ? result1:result2;
		
		//example
		/*
		 * int a=200, b=100;
		 * 
		 * int x= (a<b)? a:b; System.out.println(x);
		 */
     		
		// example 2
		
		//int x=(1==1)?100:200;
		//System.out.println(x);
		
		
		//int x=(1==2)?200:100;
		//System.out.println(x);
		
		//Example 3
		
		int person_age=15;
		String res=(person_age>=18)? "Eligible":"Not Eligible";
		System.out.println(res);
		
	}

}
