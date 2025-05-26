package com.example.backend.dto.teams;

import lombok.Data;

import java.util.UUID;

@Data
public class TeamMemberDTO {
    private UUID id;
    private UUID userId;
    private String userName;
    private String role;
}

