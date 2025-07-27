import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create Scanner object to take input from user
        Scanner sc = new Scanner(System.in);
        
        // Input two integers
        System.out.print("Enter the first integer: ");
        int a = sc.nextInt();
        
        System.out.print("Enter the second integer: ");
        int b = sc.nextInt();
        
        // Calculate difference
        int difference = Math.abs(a - b);
        
        // Output result
        System.out.println("The difference between the two integers is: " + difference);
        
        // Close the scanner
        sc.close();
    }
}
