//package com.example.backend.dto.invitation;
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Data
//public class InvitationDTO {
//    private UUID id;
//    private UUID teamId;
//    private UUID senderId;
//    private String senderName;
//    private UUID receiverId;
//    private String status;
//    private LocalDateTime createdAt;
//
//    public enum InvitationStatus {
//        PENDING, ACCEPTED, REJECTED
//    }
//}

package com.example.backend.dto.invitation;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class InvitationDTO {
    private UUID id;
    private UUID teamId;
    private UUID senderId;
    private String senderName;
    private UUID receiverId;
    private String status; // Keep it String for now (we will map enum to String)
    private LocalDateTime createdAt;
}
