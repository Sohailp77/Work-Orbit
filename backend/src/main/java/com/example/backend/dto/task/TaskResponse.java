package com.example.backend.dto.task;

import com.example.backend.Entity.Task.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private UUID assignedToId;
    private UUID teamId;
    private boolean completed;
    private Task.TaskPriority priority;
    private boolean recurring;
    private Task.TaskStatus status;
    private String assignedToName;

    public void setMessage(String s) {
    }
}
