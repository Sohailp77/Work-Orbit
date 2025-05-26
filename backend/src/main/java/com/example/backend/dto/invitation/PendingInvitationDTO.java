package com.example.backend.dto.invitation;

import java.time.LocalDateTime;
import java.util.UUID;

public interface PendingInvitationDTO {
    UUID getId();
    UUID getTeamId();
    String getTeamName(); // 👈 NEW FIELD
    UUID getSenderId();
    String getSenderName();
    UUID getReceiverId();
    String getStatus();
    LocalDateTime getCreatedAt();
}
