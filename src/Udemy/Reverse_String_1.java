package Udemy;

public class Reverse_String_1 {

	public static void main(String[] args) {
		String str="Atul";
		
	    String rev="";
	
	for(int i=str.length()-1;i>=0;i--)
	{
		rev=rev+str.charAt(i);
	}
	System.out.println("Reverse String is:"+rev);
	}

}