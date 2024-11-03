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
@WebServlet(name = "Upadate", urlPatterns = {"/Update"})
public class Update extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Session session = HibernateUtil.getSessionFactory().openSession();
        Gson gson = new Gson();
        JsonObject responJsonObject = new JsonObject();
        responJsonObject.addProperty("success", false);

        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String mobile = request.getParameter("mobile");
        Part avatarImage = request.getPart("avatarImage");

        if (firstName.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your first name");
        } else if (lastName.isEmpty()) {
            responJsonObject.addProperty("message", "Please type your last name");
        } else {

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));
            
                User user = (User) criteria.uniqueResult();
                user.setFirst_name(firstName);
                user.setLast_name(lastName);

                session.update(user);
                session.beginTransaction().commit();
                responJsonObject.addProperty("success", true);
                responJsonObject.addProperty("message", "User updated successfully");

                responJsonObject.add("user", gson.toJsonTree(user));
                if (avatarImage != null) {

                    String serverPath = request.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + File.separator + "Avatar_Images" + File.separator + mobile + ".png";
                    System.out.println(avatarImagePath);
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    
                    responJsonObject.addProperty("success", true);
                    responJsonObject.addProperty("avatarImage", avatarImagePath);
                    responJsonObject.addProperty("message", "User updated successfully");
                }

                session.close();
        }
         response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responJsonObject));
    }

}
