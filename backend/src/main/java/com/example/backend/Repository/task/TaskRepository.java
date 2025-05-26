package com.example.backend.Repository.task;

import com.example.backend.Entity.Task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByTeamId(UUID teamId);


    List<Task> findTasksByTeamId(UUID teamId);

    // (Optional) If you also need to query by user ID:
    List<Task> findTasksByAssignedToId(UUID userId);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startOfDay AND :endOfDay")
    List<Task> findAllByDueDate(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    // Fetch normal non-recurring tasks
    @Query("SELECT t FROM Task t WHERE t.recurring = false")
    List<Task> findNormalTasks();

    // Fetch recurring tasks
    @Query("SELECT t FROM Task t WHERE t.recurring = true")
    List<Task> findRecurringTasks();

    // Update this query in the repository to handle filtering based on dates
//    @Query("SELECT t FROM Task t WHERE t.dueDate IS NOT NULL AND t.dueDate BETWEEN :startOfDay AND :endOfDay")
//    List<Task> findTasksByDueDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    List<Task> findAllByRecurringTrue();

    @Query("SELECT t FROM Task t WHERE t.dueDate IS NOT NULL AND CAST(t.dueDate AS DATE) = :date")
    List<Task> findTasksDueOnDate(@Param("date") LocalDate date);





    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :start AND :end AND t.assignedTo.id = :userId AND t.team.id = :teamId AND t.recurring = false AND t.completed=false")
    List<Task> findTasksByDueDateRangeAndUserAndTeam(LocalDateTime start, LocalDateTime end, UUID userId, UUID teamId);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :start AND :end AND t.assignedTo.id = :userId AND t.recurring = false AND t.completed=false")
    List<Task> findTasksByDueDateRangeAndUser(LocalDateTime start, LocalDateTime end, UUID userId);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :start AND :end AND t.team.id = :teamId AND t.recurring = false AND t.completed=false")
    List<Task> findTasksByDueDateRangeAndTeam(LocalDateTime start, LocalDateTime end, UUID teamId);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :start AND :end AND t.recurring = false AND t.completed=false")
    List<Task> findTasksByDueDateRange(LocalDateTime start, LocalDateTime end);


}
