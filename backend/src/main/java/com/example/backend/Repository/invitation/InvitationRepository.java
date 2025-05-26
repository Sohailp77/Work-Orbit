package com.example.backend.Repository.invitation;

import com.example.backend.Entity.Invitation.Invitation;
import com.example.backend.dto.invitation.PendingInvitationDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    @Query("""
    SELECT 
        i.id AS id,
        i.team.id AS teamId,
        i.team.name AS teamName, 
        i.sender.id AS senderId,
        i.sender.firstName AS senderName,
        i.receiver.id AS receiverId,
        i.status AS status,
        i.createdAt AS createdAt
    FROM Invitation i
    WHERE i.receiver.id = :receiverId AND i.status = 'PENDING'
""")
    List<PendingInvitationDTO> findByReceiverIdAndStatus(@Param("receiverId") UUID receiverId);

    List<Invitation> findByReceiverId(UUID receiverId);
    List<Invitation> findBySenderId(UUID senderId);
    List<Invitation> findByTeamId(UUID teamId);
}
