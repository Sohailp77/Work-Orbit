package com.example.backend.Service.task;



import com.example.backend.dto.task.TaskDTO;
import com.example.backend.dto.task.TaskResponse;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    TaskResponse createTask(TaskDTO request, UUID creatorUserId);
    TaskResponse sendTodayTasksToTelegram();
//    List<TaskResponse> getFilteredTasks(String filterType);

    List<TaskResponse> getFilteredTasks(String filterType, UUID userId, UUID teamId);

    void markTaskAsComplete(UUID taskId);

    void deleteTask(UUID taskId);


}
