package com.example.backend.Service;

import com.example.backend.Entity.Task.Task;
import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;

import com.example.backend.Repository.UserRepository;
import com.example.backend.Repository.task.TaskRepository;
import com.example.backend.Repository.teams.TeamRepository;
import com.example.backend.Service.notification.HtmlMailService;
import com.example.backend.Service.notification.MailService;
import com.example.backend.Service.notification.TelegramService;
import com.example.backend.Service.task.TaskService;
import com.example.backend.dto.task.TaskDTO;
import com.example.backend.dto.task.TaskResponse;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final MailService mailService;
    private final TelegramService telegramService;
    private final HtmlMailService htmlMailService;


    @Override
    public TaskResponse createTask(TaskDTO request, UUID creatorUserId) {
        // Fetch the assigned user
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        // Fetch the team
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setAssignedTo(assignedTo);
        task.setTeam(team);
        task.setPriority(request.getPriority());
        task.setRecurring(request.isRecurring());

        if (request.isRecurring()) {
            task.setRecurringFrequency(request.getRecurringFrequency());

            if (request.getRecurringFrequency() == Task.RecurringFrequency.WEEKLY && request.getWeeklyDay() != null) {
                task.setWeeklyDay(DayOfWeek.valueOf(request.getWeeklyDay().toUpperCase()));
            }

            if (request.getRecurringFrequency() == Task.RecurringFrequency.MONTHLY && request.getMonthlyDay() != null) {
                task.setMonthlyDay(request.getMonthlyDay());
            }
        }

        // Save the task
        Task savedTask = taskRepository.save(task);

        // Send email notification
        sendTaskNotificationEmail(savedTask);

        // Send Telegram message notification
        sendTaskNotificationTelegram(savedTask);

        // Convert Entity -> DTO
        TaskResponse response = new TaskResponse();
        response.setId(savedTask.getId());
        response.setTitle(savedTask.getTitle());
        response.setDescription(savedTask.getDescription());
        response.setDueDate(savedTask.getDueDate());
        response.setAssignedToId(savedTask.getAssignedTo().getId());
        response.setTeamId(savedTask.getTeam().getId());
        response.setPriority(savedTask.getPriority());
        response.setRecurring(savedTask.isRecurring());
        response.setStatus(savedTask.getStatus());

        return response;
    }


    @Async
    public void sendTaskNotificationEmail(Task savedTask) {
        try {
            // Create necessary details for the email
            String userName = savedTask.getAssignedTo().getFirstName(); // Adjust according to your entity structure
            String taskTitle = savedTask.getTitle();
            String taskDescription = savedTask.getDescription();

            // Handle if dueDate is null
            String taskDeadline = "No Due Date";  // Default if null
            if (savedTask.getDueDate() != null) {
                taskDeadline = savedTask.getDueDate().toString(); // Format as necessary
            }

            String assignedBy = "Admin"; // Replace with actual creator if needed
            String taskLink = "http://yourapplication.com/task/" + savedTask.getId(); // Replace with your task link URL

            // Send HTML email to the assigned user using HtmlMailService
            htmlMailService.sendHtmlMail(
                    savedTask.getAssignedTo().getEmail(),
                    "New Task Assigned: " + savedTask.getTitle(),
                    userName,
                    taskTitle,
                    taskDescription,
                    taskDeadline,
                    assignedBy,
                    taskLink
            );
        } catch (MessagingException e) {
            // Log the exception or handle the error as needed
            e.printStackTrace();
            // Optionally, notify admins or perform other error handling logic
        }
    }

    @Async
    public void sendTaskNotificationTelegram(Task savedTask) {
        String taskHead = "";
        String formattedDueDate = "";

        // 1. Handle if dueDate is null
        if (savedTask.getDueDate() != null) {
            // 2. First interpret DB time as UTC (if that's how it's stored)
            ZonedDateTime utcTime = savedTask.getDueDate().atZone(ZoneId.of("UTC"));

            // 3. Convert to system default timezone (or specify one)
            ZonedDateTime localTime = utcTime.withZoneSameInstant(ZoneId.systemDefault());

            // 4. Format in 12-hour format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a");
            formattedDueDate = localTime.format(formatter);
        } else {
            // If no dueDate, set a default message or leave it empty
            formattedDueDate = "No Due Date";
        }

        // 5. Check if the task is recurring and update accordingly
        if (savedTask.isRecurring()) {
            taskHead = "Reminder Assigned";
            formattedDueDate = "";  // No due date for recurring tasks
        } else {
            taskHead = "Task Assigned";
        }

        // 6. Send Telegram message
        telegramService.sendTelegramMessage(
                savedTask.getAssignedTo().getFirstName(),
                savedTask.getTitle(),
                taskHead,
                savedTask.getDescription(),
                formattedDueDate
        );
    }



//    @Scheduled(cron = "0 0 12 * * *")
//    public void sendTodayTasksToTelegramScheduled() {
//        sendTodayTasksToTelegram();
//    }

    @Override
    public TaskResponse sendTodayTasksToTelegram() {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<Task> todaysTasks = taskRepository.findAllByDueDate(startOfDay, endOfDay);

        if (todaysTasks.isEmpty()) {

            System.out.println( today+ " No tasks due today!");
        }

        for (Task task : todaysTasks) {
            String taskHead = task.isRecurring() ? "Today's Reminder" : "Todays Task";
            String formattedDueDate = "";

            if (task.getDueDate() != null && !task.isRecurring()) {
                ZonedDateTime utcTime = task.getDueDate().atZone(ZoneId.of("UTC"));
                ZonedDateTime localTime = utcTime.withZoneSameInstant(ZoneId.systemDefault());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a");
                formattedDueDate = localTime.format(formatter);
            }

            try {
                telegramService.sendTelegramMessage(
                        task.getAssignedTo().getFirstName(),
                        task.getTitle(),
                        taskHead,
                        task.getDescription(),
                        formattedDueDate
                );
                System.out.println("Telegram message sent for task: " + task.getTitle());
            } catch (Exception e) {
                System.err.println("Failed to send Telegram message for task: " + task.getTitle());
                e.printStackTrace();
            }
        }

        TaskResponse response = new TaskResponse();
        response.setMessage("Today's tasks sent to Telegram!");
        return response;
    }



    @Override
    public List<TaskResponse> getFilteredTasks(String filterType, UUID userId, UUID teamId) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        List<Task> normalTasks;

        if (filterType.equalsIgnoreCase("today")) {
            normalTasks = fetchTasksForFilter(startOfDay, endOfDay, userId, teamId);
        } else if (filterType.equalsIgnoreCase("upcoming")) {
            LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();
            LocalDateTime futureLimit = startOfTomorrow.plusYears(1);
            normalTasks = fetchTasksForFilter(startOfTomorrow, futureLimit, userId, teamId);
        }  else if (filterType.equalsIgnoreCase("overdue")) {
            LocalDate prevYear = today.minusYears(1);
            LocalDate prevDay = today.minusDays(1);

            LocalDateTime start = prevYear.atStartOfDay(); // 1 year ago, 00:00
            LocalDateTime end = prevDay.atTime(LocalTime.MAX); // yesterday, 23:59:59.999999999

            normalTasks = fetchTasksForFilter(start, end, userId, teamId);
        }
        else {
            normalTasks = new ArrayList<>();
        }

        List<TaskResponse> normalTaskResponses = normalTasks.stream()
                .map(this::convertToTaskResponse)
                .collect(Collectors.toList());

        List<TaskResponse> recurringTaskResponses = getRecurringTasks(today, filterType, userId, teamId);

        List<TaskResponse> allFilteredTasks = new ArrayList<>();
        allFilteredTasks.addAll(normalTaskResponses);
        allFilteredTasks.addAll(recurringTaskResponses);

        return allFilteredTasks;
    }



    private List<Task> fetchTasksForFilter(LocalDateTime start, LocalDateTime end, UUID userId, UUID teamId) {
        if (userId != null && teamId != null) {
            return taskRepository.findTasksByDueDateRangeAndUserAndTeam(start, end, userId, teamId);
        } else if (userId != null) {
            return taskRepository.findTasksByDueDateRangeAndUser(start, end, userId);
        } else if (teamId != null) {
            return taskRepository.findTasksByDueDateRangeAndTeam(start, end, teamId);
        } else {
            return taskRepository.findTasksByDueDateRange(start, end);
        }
    }



    private List<TaskResponse> getRecurringTasks(LocalDate today, String filterType, UUID userId, UUID teamId) {
        List<Task> allRecurringTasks = taskRepository.findAllByRecurringTrue();
        List<TaskResponse> recurringTaskResponses = new ArrayList<>();

        for (Task task : allRecurringTasks) {
            boolean isRecurringToday = checkIfRecurringTaskMatchesDate(task, today);

            // Both user and team filters must match
            boolean matchesUser = userId == null || (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(userId));
            boolean matchesTeam = teamId == null || (task.getTeam() != null && task.getTeam().getId().equals(teamId));

            if (!(matchesUser && matchesTeam)) {
                continue; // Skip this task
            }

            if (filterType.equalsIgnoreCase("today") && isRecurringToday) {
                recurringTaskResponses.add(convertToTaskResponse(task));
            } else if (filterType.equalsIgnoreCase("upcoming") && !isRecurringToday) {
                recurringTaskResponses.add(convertToTaskResponse(task));
            }
        }

        return recurringTaskResponses;
    }




    private boolean checkIfRecurringTaskMatchesDate(Task task, LocalDate today) {
        boolean matches = false;

        if (task.getRecurringFrequency() == Task.RecurringFrequency.DAILY) {
            matches = true; // Daily tasks always match
        } else if (task.getRecurringFrequency() == Task.RecurringFrequency.WEEKLY) {
            int currentDayOfWeek = today.getDayOfWeek().getValue(); // Get current day of the week (1=Monday to 7=Sunday)
            matches = currentDayOfWeek == task.getWeeklyDay().getValue();
        } else if (task.getRecurringFrequency() == Task.RecurringFrequency.MONTHLY) {
            matches = today.getDayOfMonth() == task.getMonthlyDay();
        }

        return matches;
    }


    // Convert a Task entity to TaskResponse DTO
    private TaskResponse convertToTaskResponse(Task task) {


        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setAssignedToId(task.getAssignedTo().getId());
        response.setTeamId(task.getTeam().getId());
        response.setPriority(task.getPriority());
        response.setRecurring(task.isRecurring());
        response.setStatus(task.getStatus());
        // Fetch assigned user's name
        UUID assignedUserId = task.getAssignedTo().getId();
        userRepository.findById(assignedUserId).ifPresent(user -> {
            response.setAssignedToName(user.getFirstName());  // You need to add this field to TaskResponse
        });


        // Any additional mapping if necessary
        return response;
    }

    @Override
    public void markTaskAsComplete(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setCompleted(true); // assuming you have a `complete` field
        taskRepository.save(task);
    }

    @Override
    public void deleteTask(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }



}
