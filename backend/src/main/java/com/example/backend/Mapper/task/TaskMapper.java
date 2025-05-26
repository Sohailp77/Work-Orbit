package com.example.backend.Mapper.task;

import com.example.backend.Entity.Task.Task;
import com.example.backend.dto.task.TaskDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TaskMapper {
    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

//    Task taskDTOToTask(TaskDTO taskDTO);

    @Mapping(source = "assignedTo.id", target = "assignedToId") // Map assignedTo's ID
    @Mapping(source = "assignedTo.firstName", target = "assignedToName") // 👈 Map User's name
    @Mapping(source = "team.id", target = "teamId")
    TaskDTO taskToTaskDTO(Task task);
}
