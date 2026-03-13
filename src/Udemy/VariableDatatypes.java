package Udemy;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.opentelemetry.exporter.logging.SystemOutLogRecordExporter;

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
		
	    
	    String[]name1= {"rahul", "shetty", "academy"};
	    
	    for(int i=0; i<name1.length;i++)
	    {
	    	
	    	System.out.println(name1[i]);
	    }
	     for(String s:name1)
	     {
	    	 System.out.println(s);
	     }
	     
	     List <String> a =new ArrayList<String>();    //Create object of the class- object.method
         a.add("rahul");
         a.add("shetty");
         a.add("Academy");
         a.add("selenium1233");
        System.out.println(a.get(3));
        
        for(int i=0;i<a.size();i++)
        {
        	System.out.println(a.get(i));
        }
        System.out.println("****************");
        for(String val:a)
        {
        	System.out.println(val);
        }
         
        // item is present in ArrayList
        System.out.println(a.contains("selenium1233"));
        String [] name = {"rahul","shetty","selenium1233"};
       List<String> nameArrayList=Arrays.asList(name);
       nameArrayList.contains("selenium1233");
        
       
	}

}
