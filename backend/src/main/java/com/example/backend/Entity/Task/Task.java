package com.example.backend.Entity.Task;

import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDateTime dueDate;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id", nullable = false)
    private User assignedTo;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    // 🌟 Recurring related
    @Column(nullable = false)
    private boolean recurring = false;

    @Enumerated(EnumType.STRING)
    private RecurringFrequency recurringFrequency;  // DAILY, WEEKLY, MONTHLY

    @Enumerated(EnumType.STRING)
    private DayOfWeek weeklyDay;    // Only used if recurringFrequency == WEEKLY

    private Integer monthlyDay;     // Only used if recurringFrequency == MONTHLY

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    public enum TaskPriority {
        LOW, MEDIUM, HIGH
    }

    public enum RecurringFrequency {
        DAILY, WEEKLY, MONTHLY
    }
}

