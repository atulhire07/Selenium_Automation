package Udemy;

public class VariableDatatypes {

	public static void main(String[] args) {
		int myNum=5;
		String website="rahul shetty academy";
		char c='c';
		double nov =5.95;
		boolean myCard=true;
		
		System.out.println(myNum+" is the value stored in the myNum variable");
		System.out.println(website);
		
		//Array-
		int [] arr= new int [5];
		arr[0]=1;
		arr[1]=2;
		arr[2]=4;
		arr[3]=5;
		arr[4]=6;
		
		
		int[] arr2= {1,2,4,5,6,45,7,9,78,122};
		//System.out.println (arr2[4]);
		
		//for loop
//	    for (int i=0; i< arr.length; i++)
//	    {
//	    	 System.out.println(arr[i]);
//	    	
//	    }
	    
	    for(int i=0;i<arr2.length;i++)
	    	
	    {
	    	
	    	System.out.println(arr2[i]);
	    }
		
	    
	    String[]name= {"rahul", "shetty", "academy"};
	    
	    for(int i=0; i<name.length;i++)
	    {
	    	
	    	System.out.println(name[i]);
	    }
	     for(String s:name)
	     {
	    	 System.out.println(s);
	     }
	     

	}

}
