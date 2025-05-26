package com.example.backend.Controller.teams;

import com.example.backend.Service.teams.TeamService;
import com.example.backend.dto.teams.TeamDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams") // Base URL: /api/teams
public class TeamController {

    @Autowired
    private TeamService teamService;

    // ✅ Create a new team
    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        TeamDTO createdTeam = teamService.createTeam(teamDTO);
        return ResponseEntity.ok(createdTeam);
    }

    // ✅ Get team details by ID
    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable UUID id) {
        TeamDTO teamDTO = teamService.getTeamById(id);
        return ResponseEntity.ok(teamDTO);
    }

    // ✅ Get teams by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByUserId(@PathVariable UUID userId) {
        List<TeamDTO> teams = teamService.getTeamsByUserId(userId);
        return ResponseEntity.ok(teams);
    }

    // DELETE /api/teams/{teamId}
    @DeleteMapping("/{teamId}")
    public ResponseEntity<String> deleteTeam(@PathVariable UUID teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.ok("Team deleted successfully");
    }

    @DeleteMapping("/{teamId}/exit/{userId}")
    public ResponseEntity<String> exitTeam(@PathVariable UUID teamId, @PathVariable UUID userId) {
        teamService.exitTeam(teamId, userId);
        return ResponseEntity.ok("Successfully exited the team.");
    }

    @GetMapping("/All")
    public ResponseEntity<List<Map<String, Object>>> getAllTeams() {
        List<Map<String, Object>> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }


}
