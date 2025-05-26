package com.example.backend.Service.task;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskSchedulerService {

    private final TaskService taskService;

    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Kolkata")  // 9 AM everyday
    public void sendTodayTasksToTelegramScheduled() {
        taskService.sendTodayTasksToTelegram();
    }
}
