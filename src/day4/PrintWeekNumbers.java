package day4;

public class PrintWeekNumbers {

	public static void main(String[] args) {
		
		String weekname="friday";
		
		
		switch(weekname)
		{
	       case "sunday" : System.out.println(1); break;
		   case "monday": System.out.println(2); break;
		   case "tuesday": System.out.println(3); break;
		   case "wednesday": System.out.println(4); break;
		   case "thursday": System.out.println(5); break;
		   case "friday": System.out.println(6); break;
		   case "saturday": System.out.println(7); break;
		   default : System.out.println("Invalid Week Name");
		   
		}
		
		

	}

}
