
// BinaryMultiply.java
import java.util.Scanner;

public class BinaryMultiply {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter first binary number: ");
        String b1 = sc.next();
        System.out.print("Enter second binary number: ");
        String b2 = sc.next();
        sc.close();

        int num1 = Integer.parseInt(b1, 2);
        int num2 = Integer.parseInt(b2, 2);
        int product = num1 * num2;

        System.out.println("Product in binary: " + Integer.toBinaryString(product));
    }
}
