package com.example.backend.Entity;

import com.example.backend.Entity.teams.Team;
import com.example.backend.Entity.teams.TeamMember;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.backend.Entity.Task.Task;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "\"user\"")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id @GeneratedValue(strategy= GenerationType.UUID)
    private UUID id;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    private String firstName;

    @Column(nullable = true)
    private boolean deleted = false; // Soft delete flag

    @Column(nullable = true)
    private boolean verified = false; // Email verified flag




    // Relations
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Team> createdTeams;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TeamMember> teamMemberships;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    private List<Task> assignedTasks;

}

