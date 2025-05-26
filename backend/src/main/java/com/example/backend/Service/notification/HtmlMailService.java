package com.example.backend.Service.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HtmlMailService {

    private final JavaMailSender mailSender;

    public void sendHtmlMail(String to, String subject, String userName, String taskTitle,String taskDescription, String taskDeadline, String assignedBy, String taskLink) throws MessagingException {
        String htmlContent = generateHtmlContent(userName, taskTitle,taskDescription, taskDeadline, assignedBy, taskLink);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("sohailp012@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML content

        mailSender.send(message);
    }

    // Helper method to generate the HTML content dynamically
    private String generateHtmlContent(String userName, String taskTitle, String taskDescription, String taskDeadline, String assignedBy, String taskLink) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head><meta charset=\"UTF-8\"><title>Task Assigned</title></head>" +
                "<script src=\"https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4\"></script>\n"+
                "<body style=\"background-color: #f8fafc; padding: 20px; font-family: Arial, sans-serif;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;\">" +
                "<h2 style=\"font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 20px; text-align: center;\">📋 New Task Assigned</h2>" +
                "<p style=\"font-size: 16px; color: #334155; margin-bottom: 10px;\">Hello <strong>" + userName + "</strong>,</p>" +
                "<p style=\"font-size: 16px; color: #334155; margin-bottom: 20px;\">You have been assigned a new task. Here are the details:</p>" +
                "<div style=\"background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;\">" +
                "<p style=\"margin: 5px 0;\"><strong>Task Title:</strong> " + taskTitle + "</p>" +
                "<p style=\"margin: 5px 0;\"><strong>Task Description:" +taskDescription +"</p>"+
                "<p style=\"margin: 5px 0;\"><strong>Deadline:</strong> " + taskDeadline + "</p>" +
                "<p style=\"margin: 5px 0;\"><strong>Assigned By:</strong> " + assignedBy + "</p>" +
                "</div>" +
                "<a href=\"" + taskLink + "\" style=\"display: block; width: fit-content; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center; margin: 0 auto;\">View Task</a>" +
                "<p style=\"font-size: 14px; color: #94a3b8; margin-top: 30px; text-align: center;\">Work-Orbit Team 🚀</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
