package day3;

public class OperatorsDemo {

	public static void main(String[] args) 
	{
		// 1.Arithmetic operators + - * / %
		int a=10, b=20;
		
		int result=a+b;
		System.out.println("Sum of a and b is:"+result);
		
		System.out.println("Sum of a and b is:"+(a+b));
		System.out.println("Diff of a and b is:"+(a-b));
		System.out.println("Multi of a and b is:"+(a*b));
		System.out.println("Div of a and b is:"+(a+b));
		System.out.println("Modulo of a and b is:"+(a%b));
		

		// 2.Relational/ comparison Operators > >= <  <= != ==
		// return boolean value - true/false
		
	    System.out.println(a>b); //true
	    System.out.println(a<b); //false
	    System.out.println(a>=b);//true
	    System.out.println(a<=b); //false
		
	    
	    b=20;
	    System.out.println(a<=b); //true
	    System.out.println(a>=b); //true
	    
	    System.out.println(a!=b); //false
	    System.out.println(a==b); //true
	    
	    boolean res=a>b;
	    System.out.println(res);
	    
	    
	    // 3. Logical Operators  && || !
	    //returns boolean value - true/false
	    // wroks between 2 boolean values
	    
	    boolean x=true;
	    boolean y=false;
	    
	    System.out.println( x && y); // false
	    System.out.println(x || y); // true
	    System.out.println(!x); //false
	    System.out.println(!y); //true
	    
	    boolean b1=10>20;  //false
	    System.out.println(b1);
	    
	    boolean b2=20>10;  //true
	    System.out.println(b1);
	    
	    
	    System.out.println(b1 && b2);  //false
	    System.out.println(b1 || b2); //true
	    
	    
	    System.out.println((10<20) && (20>10));   //true
	    
	}

}
