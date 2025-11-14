package day3;

public class DecrementOperator {

	public static void main(String[] args)
	
	{

		//case 1
		/*int a=10;
		
		a-	-; // a=a-1;
	    System.out.println(a); //9
	    */
	    
	    //case 1 :  post decrement
	    /*int a=100;
	    
	    int res=a--;
	    System.out.println(res); //100
	    System.out.println(a); //99
	    */
		
		//case 3 : Pre-decrement
		int a=100;
		int res=--a;
		
		System.out.println(res); //99
		System.out.println(a);   //99
		
		
	}

}
