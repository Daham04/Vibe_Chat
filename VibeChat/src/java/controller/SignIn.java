package controller;

import java.nio.file.Files;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
        String mobile = requestJson.get("mobile").getAsString();
        String password = requestJson.get("password").getAsString();

        if (mobile.isEmpty()) {
            //mobile number is blank
            responseJson.addProperty("message", "Please fill your mobile number");
        } else if (password.isEmpty()) {
            //password is blank
            responseJson.addProperty("message", "Please fill your password");
        } else if (!Validation.isPasswordValid(password)) {
            //invalid password
            responseJson.addProperty("message", "Invalid password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            //seacrh mobile
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", mobile));
            criteria1.add(Restrictions.eq("password", password));

            if (!criteria1.list().isEmpty()) {
                // mobile number already used
                User user = (User) criteria1.uniqueResult();
                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Sign in Success");
                responseJson.add("user", gson.toJsonTree(user));
            } else {
                responseJson.addProperty("message", "Invalid Credintial");
            }
            session.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
