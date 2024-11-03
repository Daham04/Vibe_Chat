/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.User_Status;
import java.io.File;
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

/**
 *
 * @author daham
 */
@WebServlet(name = "LoadHomeData", urlPatterns = {"/LoadHomeData"})
public class LoadHomeData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            Gson gson = new Gson();

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", false);
            responseJson.addProperty("message", "Unable to process your request");
            JsonArray jsonChatArray = new JsonArray();

            Session session = HibernateUtil.getSessionFactory().openSession();

            //user id from request parameter
            String id = request.getParameter("id");

            User user = (User) session.get(User.class, Integer.parseInt(id));

            User_Status user_Status = (User_Status) session.get(User_Status.class, 1);
            user.setUser_status(user_Status);
            session.update(user);

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.ne("id", user.getId()));

            List<User> otherUserList = criteria1.list();
            for (User otherUser : otherUserList) {

                //get last conversations
                Criteria criteria2 = session.createCriteria(Chat.class);
                criteria2.add(Restrictions.or(
                        Restrictions.and(Restrictions.eq("from_user", user), Restrictions.eq("to_user", otherUser)),
                        Restrictions.and(Restrictions.eq("from_user", otherUser), Restrictions.eq("to_user", user))
                ));
                criteria2.addOrder(Order.desc("id"));
                criteria2.setMaxResults(1);

                JsonObject chatItem = new JsonObject();
                chatItem.addProperty("other_user_id", otherUser.getId());
                chatItem.addProperty("mobile", otherUser.getMobile());
                chatItem.addProperty("other_user_name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
                chatItem.addProperty("other_user_status", otherUser.getUser_status().getId());//1 = online, 2 =offline

                //check avatar image
                String serverpath = request.getServletContext().getRealPath("");
                String otherUserAvatarImagePath = serverpath + File.separator + "Avatar_Images" + File.separator + otherUser.getMobile() + ".png";
                File otherUserAvatarImagefile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarImagefile.exists()) {
                    chatItem.addProperty("other_user_found", true);
                } else {
                    chatItem.addProperty("other_user_found", false);
                    chatItem.addProperty("other_user_avatar_letters", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));
                }

                //get chat list
                List<Chat> chatList = criteria2.list();
                
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MMM dd hh:ss a");

                //get other user one by one 
                if (criteria2.list().isEmpty()) {
                    //no conversation 
                    chatItem.addProperty("message", "Lets Start new conversation");
                    chatItem.addProperty("datetime", dateFormat.format(user.getRegistration_date_time()));
                    chatItem.addProperty("chat_status", 1);//1 = seen, 2 =unseen
                    chatItem.addProperty("registration_date_time", dateFormat.format(otherUser.getRegistration_date_time()));//1 = seen, 2 =unseen
                } else {
                    //found last chat
                    chatItem.addProperty("message", chatList.get(0).getMessage());
                    chatItem.addProperty("datetime", dateFormat.format(chatList.get(0).getDate_time()));
                    chatItem.addProperty("chat_status", chatList.get(0).getChat_status().getId());
                    chatItem.addProperty("registration_date_time", dateFormat.format(otherUser.getRegistration_date_time()));//1 = seen, 2 =unseen
                }

                //get last conversations
                jsonChatArray.add(chatItem);

            }

            //get chat list
            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Success");

            responseJson.add("chatArray", gson.toJsonTree(jsonChatArray));

            session.beginTransaction().commit();
            session.close();

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
