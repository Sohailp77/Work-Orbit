package com.example.backend.Repository.teams;

import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {

    // Find a team by its name
    Team findByName(String name);

    // Find all teams created by a specific user
    List<Team> findAllByCreatedBy(User createdBy);

    // Find all teams with a name containing a certain string
    List<Team> findByNameContaining(String name);

    // Custom query example to find teams by a user
    @Query("SELECT t FROM Team t WHERE t.createdBy = :user")
    List<Team> findTeamsByUser(@Param("user") User user);
}
