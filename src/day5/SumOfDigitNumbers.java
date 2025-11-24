package day5;

public class SumOfDigitNumbers {

	public static void main(String[] args) {
		
		
		int num=5478;
		
		int sum=0;
		
		while(num>0)
		{
			sum=sum+num%10;  //4+3+2
			num=num/10; ///123  12  1   0
		}
		System.out.println("sum of Digit in a Number:"+sum);

	}

}
