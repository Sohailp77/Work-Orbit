package com.example.backend.dto.task;

import com.example.backend.Entity.Task.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private UUID assignedToId;
    private UUID teamId;
    private Task.TaskPriority priority;
    private Boolean completed;
    private boolean recurring;
    private Task.RecurringFrequency recurringFrequency;
    private String weeklyDay; // optional if recurringFrequency is WEEKLY
    private Integer monthlyDay; // optional if recurringFrequency is MONTHLY
    private String assignedToName; // 👈 Add this

}
