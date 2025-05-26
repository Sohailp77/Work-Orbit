package com.example.backend.Repository.teams;

import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import com.example.backend.Entity.teams.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {

    boolean existsByTeamAndUser(Team team, User user);

    Optional<TeamMember> findByTeamAndUser(Team team, User user);

    List<TeamMember> findAllByUserId(UUID userId);

    List<TeamMember> findAllByTeam(Team team); // Fetch all members of a team

    List<TeamMember> findByRoleAndTeam(Team team, TeamMember.Role role); // Fetch team members by role

    @Query("SELECT tm FROM TeamMember tm WHERE tm.team = :team AND tm.role = :role")
    List<TeamMember> findByRoleInTeam(@Param("team") Team team, @Param("role") TeamMember.Role role);


}
