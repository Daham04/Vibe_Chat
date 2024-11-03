package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        String user_id = request.getParameter("user_id");
        String other_user_id = request.getParameter("other_user_id");

        //get user
        User user = (User) session.get(User.class, Integer.parseInt(user_id));

        //get other user
        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

        //get chats 
        Criteria criteria1 = session.createCriteria(Chat.class);

        criteria1.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from_user", user), Restrictions.eq("to_user", other_user)),
                Restrictions.and(Restrictions.eq("to_user", user), Restrictions.eq("from_user", other_user))
        ));

        //sort messages
        criteria1.addOrder(Order.asc("date_time"));

        //get chat list
        List<Chat> chatList = criteria1.list();

        //get chat status = 1
        Chat_Status chatStatus = (Chat_Status) session.get(Chat_Status.class, 1);

        //create chat array
        JsonArray chatArray = new JsonArray();

        //create date time format
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, hh::mm a");

        for (Chat chat : chatList) {

            //create chat object
            JsonObject chatObject = new JsonObject();
            chatObject.addProperty("message", chat.getMessage());
            chatObject.addProperty("datetime", dateFormat.format(chat.getDate_time()));

            //get chat from other user 
            if (chat.getFrom_user().getId() == other_user.getId()) {

                //add side to chat object other user
                chatObject.addProperty("side", "left");

                //get only unseen chat
                if (chat.getChat_status().getId() == 2) {
                    //update chat status -> seen
                    chat.setChat_status(chatStatus);
                    session.update(chat);
                }

            } else {
                //add side to chat object log user
                chatObject.addProperty("side", "right");
                chatObject.addProperty("status", chat.getChat_status().getId());//1 = seen ,2 = unseen
            }

            // add chat into chat array
            chatArray.add(chatObject);
        }

        //update db
        session.beginTransaction().commit();

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(chatArray));

    }

}
