package day6;

/*
 1) Declare an array
 2) add values into array
 3) find size of an array
 4) read single value from an array
 5) read multiple values from an array
 */
public class TwoDimensionalArray {

	public static void main(String[] args) {

		// declaring array

		// Approach 1

		//int a[][] = new int[3][2];
		
		 // int [][]a=new int []3[2]; 
		  //int []a[]new int []3[2];
			/*
			 * a[0][0]=100; a[0][1]=200;
			 * 
			 * a[1][0]=300; a[1][1]=400;
			 * 
			 * a[2][0]=500; a[2][1]=600;
			 */
		  
		 
		// Approach 2
      int a [][]= {  {100,200}, {300,400}, {500,600}  }; 
      
      //find size of an array
      System.out.println("length of rows:"+a.length);
      System.out.println ("length of columns:"+a[0].length);
      
      
      //read single value from an array
      //System.out.println(a[2][1]);
      
      //normal for loop
      for (int r =0;r<=2;r++)
    	  
      {
    	 for(int c=0;c<=1;c++)
      }
      
	}

}
