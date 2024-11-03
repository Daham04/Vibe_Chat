package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validation;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Session session = HibernateUtil.getSessionFactory().openSession();
        Gson gson = new Gson();
        JsonObject responJsonObject = new JsonObject();
        responJsonObject.addProperty("success", false);

        String mobile = request.getParameter("mobile");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String password = request.getParameter("password");
        Part avatarImage = request.getPart("avatarImage");

        if (mobile.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your mobile number");
        } else if (!Validation.isMobileNumberValid(mobile)) {
            responJsonObject.addProperty("message", "Invalid mobile number");
        } else if (firstName.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your first name");
        } else if (lastName.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your last name");
        } else if (password.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your password");
        } else if (!Validation.isPasswordValid(password)) {
            responJsonObject.addProperty("message", "Password must include 8 charactors with one Capital letter and Special charactor");
        } else {

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));

            if (!criteria.list().isEmpty()) {
                responJsonObject.addProperty("message", "Mobile number already used.");
            } else {
                User user = new User();
                user.setFirst_name(firstName);
                user.setLast_name(lastName);
                user.setMobile(mobile);
                user.setPassword(password);
                user.setRegistration_date_time(new Date());

                User_Status user_Status = (User_Status) session.get(User_Status.class, 2);
                user.setUser_status(user_Status);

                session.save(user);
                session.beginTransaction().commit();
                responJsonObject.addProperty("success", true);
                responJsonObject.addProperty("message", "User registration successfully");

                if (avatarImage != null) {

                    String serverPath = request.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + File.separator + "Avatar_Images" + File.separator + mobile + ".png";
                    System.out.println(avatarImagePath);
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    responJsonObject.addProperty("success", true);
                    responJsonObject.addProperty("message", "User registration successfully");
                }

                session.close();
            }

        }
         response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responJsonObject));
    }

}
