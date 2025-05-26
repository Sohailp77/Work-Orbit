package com.example.backend.Repository;

import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);

    // Query to find all users who are not part of a specific team
    @Query("SELECT u FROM User u LEFT JOIN u.teamMemberships tm WHERE tm.team.id != :teamId OR tm.team.id IS NULL")
    List<User> findUsersNotInTeam(UUID teamId);
}
