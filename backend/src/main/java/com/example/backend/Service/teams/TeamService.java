package com.example.backend.Service.teams;

import com.example.backend.Entity.Task.Task;
import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import com.example.backend.Entity.teams.TeamMember;
import com.example.backend.Mapper.task.TaskMapper;
import com.example.backend.Mapper.teams.TeamMapper;
import com.example.backend.Mapper.teams.TeamMemberMapper;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Repository.task.TaskRepository;
import com.example.backend.Repository.teams.TeamMemberRepository;
import com.example.backend.Repository.teams.TeamRepository;
import com.example.backend.dto.task.TaskDTO;
import com.example.backend.dto.teams.TeamDTO;
import com.example.backend.dto.teams.TeamMemberDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    private TaskRepository taskRepository;

    public TeamDTO createTeam(TeamDTO teamDTO) {
        if (teamDTO.getCreatedById() == null) {
            throw new IllegalArgumentException("The creator ID (createdById) must not be null");
        }

        User user = userRepository.findById(teamDTO.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + teamDTO.getCreatedById()));

        Team team = TeamMapper.INSTANCE.teamDTOToTeam(teamDTO);
        team.setCreatedBy(user);

        Team savedTeam = teamRepository.save(team);

        // ✅ Check if user is already a member before inserting
        boolean exists = teamMemberRepository.existsByTeamAndUser(savedTeam, user);
        if (!exists) {
            TeamMember teamMember = new TeamMember();
            teamMember.setTeam(savedTeam);
            teamMember.setUser(user);
            teamMember.setRole(TeamMember.Role.ADMIN);
            teamMemberRepository.save(teamMember);
        }

        return TeamMapper.INSTANCE.teamToTeamDTO(savedTeam);
    }



    public TeamDTO getTeamById(UUID id) {
        // Fetch the team
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team with ID " + id + " not found"));

        // Map to TeamDTO
        TeamDTO teamDTO = TeamMapper.INSTANCE.teamToTeamDTO(team);

        // Map members
        List<TeamMemberDTO> members = team.getMembers() != null
                ? team.getMembers().stream()
                .map(TeamMemberMapper.INSTANCE::teamMemberToTeamMemberDTO)
                .collect(Collectors.toList())
                : Collections.emptyList();
        teamDTO.setMembers(members);

        // 🔥 Fetch and map tasks
        // Map tasks
        List<TaskDTO> tasks = team.getTasks() != null
                ? team.getTasks().stream()
                .map(TaskMapper.INSTANCE::taskToTaskDTO)
                .collect(Collectors.toList())
                : Collections.emptyList();
        teamDTO.setTasks(tasks);   // 🛠 Make sure TeamDTO has a `List<TaskDTO> tasks;`

        System.out.print(teamDTO);
        return teamDTO;
    }




    public List<TeamDTO> getTeamsByUserId(UUID userId) {
        List<TeamMember> teamMembers = teamMemberRepository.findAllByUserId(userId);

        if (teamMembers.isEmpty()) {
            // You can return a message or an empty list
            return Collections.emptyList();
        }

        return teamMembers.stream()
                .map(TeamMember::getTeam)
                .map(TeamMapper.INSTANCE::teamToTeamDTO)
                .toList();
    }


    @Transactional
    public void deleteTeam(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team with ID " + teamId + " not found"));

        // This will automatically delete all associated members, tasks, invitations
        teamRepository.delete(team);
    }

    public void exitTeam(UUID teamId, UUID userId) {
        // Fetch the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team with ID " + teamId + " not found"));

        // Fetch the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));

        // Check if the user is the creator of the team
        if (team.getCreatedBy().getId().equals(userId)) {
            throw new IllegalStateException("Team creator cannot leave the team. Consider deleting the team instead.");
        }

        // Find the team member entry
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of the team"));

        // Remove the membership
        teamMemberRepository.delete(teamMember);
    }



    public List<Map<String, Object>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();

        return teams.stream().map(team -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", team.getId());
            map.put("name", team.getName());
            return map;
        }).collect(Collectors.toList());
    }

}
