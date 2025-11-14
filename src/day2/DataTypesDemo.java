package day2;

public class DataTypesDemo
{

	public static void main(String[] args)
	{
		//Numeric data types
		
		int a=100, b=200;
		System.out.println("the value of a is:"+a);
		System.out.println("the value of b is:"+b);
		
		System.out.println(a+b);
		
		System.out.println("the sum of a and b is:"+(a+b));
		
		
		byte by=125;
		System.out.println(by);
		
		short sh=3535;
		System.out.println(sh);
		
		long l=3504359434345L; //literal is needed L/l
		System.out.println(l);
		
		
		//Decimal Numbers-- float, double
		
		float item_price=15.5F;  //literal is needed F/f
        System.out.println(item_price);
         
         
        double dbl=1234.5645;
        System.out.println(dbl);
        
        
        char grad='A';
        System.out.println(grad);
        
        String name= "Atul";
        System.out.println(name);
        
        //char ch ="ABC";   //Invalid
      //  String ch='ABC';  //invalid
       // String ch='A';   //invalid
        String ch="A";  // Valid
        
        boolean bl=false;   // allow only true/false
        System.out.println(bl);
        
       // boolean bl="true";   //not valid
        // boolean bl="false"; //not valid
        
        // String bl=true;   //not valid
        
        
        String b2="true";  //valid	
        
	}

}
