import java.util.Scanner;

public class NumberDifference {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read two integers
        int a = sc.nextInt();
        int b = sc.nextInt();

        // Compute absolute difference
        int difference = Math.abs(a - b);

        // Print result
        System.out.println(difference);
    }
}
