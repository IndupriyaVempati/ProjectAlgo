import java.util.Scanner;

public class Main{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input values
        int n = sc.nextInt();
        int m = sc.nextInt();        // Print remainder
        System.out.println(n % m);
        
        sc.close();
    }
}
