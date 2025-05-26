package com.example.backend.dto.teams;

import com.example.backend.dto.task.TaskDTO;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TeamDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID createdById;

    private List<TeamMemberDTO> members;  // <<< ADD THIS LINE
    private List<TaskDTO> tasks;  // 👈 Add this

}
