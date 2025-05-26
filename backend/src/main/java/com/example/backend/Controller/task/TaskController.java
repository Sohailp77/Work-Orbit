    package com.example.backend.Controller.task;

    import com.example.backend.Service.task.TaskService;
    import com.example.backend.dto.task.TaskDTO;
    import com.example.backend.dto.task.TaskResponse;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.time.ZonedDateTime;
    import java.util.List;
    import java.util.UUID;

    @RestController
    @RequestMapping("/api/tasks")
    @RequiredArgsConstructor
    public class TaskController {
        private final TaskService taskService;

        @PostMapping("/create")
        public TaskResponse createTask(@RequestBody TaskDTO request, @RequestParam UUID creatorUserId) {
            return taskService.createTask(request, creatorUserId);
        }


        @GetMapping("/server-time")
        public String getServerTime() {
            ZonedDateTime now = ZonedDateTime.now();
            return "Server Time: " + now.toString();
        }

        // Endpoint to fetch filtered tasks (today or upcoming)
//        @GetMapping("/filter")
//        public ResponseEntity<List<TaskResponse>> getFilteredTasks(@RequestParam String filterType) {
//            List<TaskResponse> tasks = taskService.getFilteredTasks(filterType);
//            return new ResponseEntity<>(tasks, HttpStatus.OK);
//
//        }



        @GetMapping("/filter")
        public ResponseEntity<List<TaskResponse>> getTasks(
                @RequestParam String filterType,
                @RequestParam(required = false) UUID userId,
                @RequestParam(required = false) UUID teamId) {

            List<TaskResponse> tasks = taskService.getFilteredTasks(filterType, userId, teamId);
            return ResponseEntity.ok(tasks);
        }

        @PutMapping("/{id}/complete")
        public ResponseEntity<Void> completeTask(@PathVariable UUID id) {
            taskService.markTaskAsComplete(id);
            return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        }


    }
