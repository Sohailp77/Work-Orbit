//package com.example.backend.Service.notification;
//
//import com.example.backend.Config.TelegramConfig;
//import com.fasterxml.jackson.annotation.JsonProperty;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j // Lombok annotation to automatically add a logger
//public class TelegramService {
//
//    private final TelegramConfig telegramConfig;
//    private final RestTemplate restTemplate;
//
//    public void sendTelegramMessage(String userName, String taskTitle, String taskDescription, String dueDate) {
//        String message ="👤 " + userName + "\n\n"
//                + "✅  New Task Assigned! \n\n"
//                + "📄  Task: " + taskTitle + "\n"
//                + "🗒️  Description: " + taskDescription + "\n"
//                + "📅  Due Date: " + dueDate;
//
//        // Create the message payload as a JSON object
//        TelegramMessage telegramMessage = new TelegramMessage(telegramConfig.getChatId(), message, "MarkdownV2");
//
//        // Set up the URL for the POST request
//        String url = "https://api.telegram.org/bot" + telegramConfig.getToken() + "/sendMessage";
//
//        // Create headers to specify the content type as application/json
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        // Create HttpEntity with the payload and headers
//        HttpEntity<TelegramMessage> entity = new HttpEntity<>(telegramMessage, headers);
//
//        try {
//            // Make the POST request to Telegram API
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//
//            if (!response.getStatusCode().is2xxSuccessful()) {
//                log.error("Failed to send Telegram message: HTTP error {}", response.getStatusCode());
//                throw new RuntimeException("Failed to send Telegram message: HTTP error " + response.getStatusCode());
//            }
//
//            if (response.getBody() != null && !response.getBody().contains("\"ok\":true")) {
//                log.error("Telegram API error: {}", response.getBody());
//                throw new RuntimeException("Telegram API error: " + response.getBody());
//            }
//        } catch (Exception e) {
//            log.error("Error occurred while sending Telegram message", e);
//            throw new RuntimeException("Error occurred while sending Telegram message", e);
//        }
//    }
//
//    // TelegramMessage class to structure the request body with Lombok for brevity
//    @Data
//    public static class TelegramMessage {
//        @JsonProperty("chat_id")
//        private String chatId;
//        private String text;
//        private String parseMode;
//
//        // Lombok @Data generates constructor, getters, setters, toString, equals, hashcode
//        public TelegramMessage(String chatId, String text, String parseMode) {
//            this.chatId = chatId;
//            this.text = text;
//            this.parseMode = parseMode;
//        }
//    }
//}


package com.example.backend.Service.notification;

import com.example.backend.Config.TelegramConfig;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j // Lombok annotation to automatically add a logger
public class TelegramService {

    private final TelegramConfig telegramConfig;
    private final RestTemplate restTemplate;

    public void sendTelegramMessage(String userName,String taskTitle, String taskHead, String taskDescription, String dueDate) {
        String message = "👤 " + escapeMarkdown(userName) + "\n\n"
                + "✅ "+ taskHead +"!\n\n"
                + "📄 Task " + escapeMarkdown(taskTitle) + "\n"
                + "🗒️ Description: " + escapeMarkdown(taskDescription) + "\n"
                + "📅 Due Date: " + escapeMarkdown(dueDate);

        // Create the message payload as a JSON object
        TelegramMessage telegramMessage = new TelegramMessage(telegramConfig.getChatId(), message, "MarkdownV2");

        // Set up the URL for the POST request
        String url = "https://api.telegram.org/bot" + telegramConfig.getToken() + "/sendMessage";

        // Create headers to specify the content type as application/json
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create HttpEntity with the payload and headers
        HttpEntity<TelegramMessage> entity = new HttpEntity<>(telegramMessage, headers);

        try {
            // Make the POST request to Telegram API
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Failed to send Telegram message: HTTP error {}", response.getStatusCode());
                throw new RuntimeException("Failed to send Telegram message: HTTP error " + response.getStatusCode());
            }

            if (response.getBody() != null && !response.getBody().contains("\"ok\":true")) {
                log.error("Telegram API error: {}", response.getBody());
                throw new RuntimeException("Telegram API error: " + response.getBody());
            }
        } catch (Exception e) {
            log.error("Error occurred while sending Telegram message", e);
            throw new RuntimeException("Error occurred while sending Telegram message", e);
        }
    }

    // TelegramMessage class to structure the request body with Lombok for brevity
    @Data
    public static class TelegramMessage {
        @JsonProperty("chat_id")
        private String chatId;
        private String text;
        private String parseMode;

        // Lombok @Data generates constructor, getters, setters, toString, equals, hashcode
        public TelegramMessage(String chatId, String text, String parseMode) {
            this.chatId = chatId;
            this.text = text;
            this.parseMode = parseMode;
        }
    }

    private String escapeMarkdown(String text) {
        if (text == null) return "";
        return text
                .replace("_", "\\_")
                .replace("*", "\\*")
                .replace("[", "\\[")
                .replace("]", "\\]")
                .replace("(", "\\(")
                .replace(")", "\\)")
                .replace("~", "\\~")
                .replace("`", "\\`")
                .replace(">", "\\>")
                .replace("#", "\\#")
                .replace("+", "\\+")
                .replace("-", "\\-")
                .replace("=", "\\=")
                .replace("|", "\\|")
                .replace("{", "\\{")
                .replace("}", "\\}")
                .replace(".", "\\.")
                .replace("!", "\\!");
    }

}
