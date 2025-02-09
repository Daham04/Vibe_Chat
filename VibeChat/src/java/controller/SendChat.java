package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Session;

@WebServlet(name = "SendChat", urlPatterns = {"/SendChat"})
public class SendChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        
        Session session = HibernateUtil.getSessionFactory().openSession();

        //log_user_id=1&other_user_id=2&message=Hello
        String log_user_id = request.getParameter("log_user_id");
        String other_user_id = request.getParameter("other_user_id");
        String message = request.getParameter("message");
        
        //get log user
        User logUser = (User) session.get(User.class, Integer.parseInt(log_user_id));
        
        //get other user
        User otherUser = (User) session.get(User.class, Integer.parseInt(other_user_id));
        
        //save chat
        Chat chat = new Chat();
        
        //chat status 2
        Chat_Status chatStatus = (Chat_Status) session.get(Chat_Status.class,2);
        
        chat.setChat_status(chatStatus);
        chat.setDate_time(new Date());
        chat.setFrom_user(logUser);
        chat.setTo_user(otherUser);
        chat.setMessage(message);
        
        session.save(chat);
        try {
            session.beginTransaction().commit();
        responseJson.addProperty("success", true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

   
}
