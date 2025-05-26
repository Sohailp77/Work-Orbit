package com.example.backend.Entity.Invitation;

import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invitation")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)  // This will handle cascading deletes in DB
    private Team team;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender; // The user who sent the invitation

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver; // The user who received the invitation

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvitationStatus status; // PENDING, ACCEPTED, REJECTED

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum InvitationStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
