package model;

public class Validation {

    public static boolean isPasswordValid(String password) {
        return password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$");
    }

    public static boolean isMobileNumberValid(String mobile) {
        return mobile.matches("^07[01245678]{1}[0-9]{7}$");
                
    }
}
