package day5;

public class ReverseNumWithoutUserIP {

	public static void main(String[] args) {
		int orinum=766521;
		int reversenum=0;
		
		while(orinum!=0)
		{
			int digit=orinum%10;
			reversenum=reversenum*10+digit;
			orinum/=10;
		}
		System.out.println("Reverse Number: "+reversenum);
	}

}
