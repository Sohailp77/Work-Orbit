package com.example.backend.Service.invitation;

import com.example.backend.Entity.Invitation.Invitation;
import com.example.backend.Entity.User;
import com.example.backend.Entity.teams.Team;
import com.example.backend.Entity.teams.TeamMember;
import com.example.backend.Mapper.invitation.InvitationMapper;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Repository.invitation.InvitationRepository;
import com.example.backend.Repository.teams.TeamMemberRepository;
import com.example.backend.Repository.teams.TeamRepository;
import com.example.backend.dto.invitation.InvitationDTO;
import com.example.backend.dto.invitation.PendingInvitationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class InvitationService {
    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    // Send an invitation - Updated to accept InvitationDTO
    public InvitationDTO sendInvitation(InvitationDTO invitationDTO) {
        // Fetching entities using the IDs from the InvitationDTO
        Team team = teamRepository.findById(invitationDTO.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        User sender = userRepository.findById(invitationDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(invitationDTO.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        // Create and save the Invitation entity
        Invitation invitation = new Invitation();
        invitation.setTeam(team);
        invitation.setSender(sender);
        invitation.setReceiver(receiver);
        invitation.setStatus(Invitation.InvitationStatus.PENDING);

        // Save the invitation and return the mapped DTO
        Invitation savedInvitation = invitationRepository.save(invitation);
        return InvitationMapper.INSTANCE.invitationToInvitationDTO(savedInvitation);
    }

    // Get all invitations for a user - No change needed
    public List<InvitationDTO> getInvitationsForUser(UUID receiverId) {
        List<Invitation> invitations = invitationRepository.findByReceiverId(receiverId);
        return invitations.stream().map(InvitationMapper.INSTANCE::invitationToInvitationDTO).toList();
    }

    // Accept an invitation and add the user to the team
    public InvitationDTO acceptInvitation(UUID invitationId) {
        // Fetch the invitation from the repository
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Fetch the receiver (user who accepted the invitation)
        User receiver = invitation.getReceiver(); // Access the User object from the Invitation

        // Fetch the team from the invitation
        Team team = invitation.getTeam(); // Access the Team object from the Invitation

        // Set the invitation status to ACCEPTED
        invitation.setStatus(Invitation.InvitationStatus.ACCEPTED);

        // Save the updated invitation
        Invitation updatedInvitation = invitationRepository.save(invitation);

        // Add the user to the team
        TeamMember teamMember = new TeamMember();
        teamMember.setTeam(team);
        teamMember.setUser(receiver);

        // Set a default role (e.g., MEMBER)
        teamMember.setRole(TeamMember.Role.MEMBER); // Ensure role is set

        // Save the team member
        teamMemberRepository.save(teamMember);

        // Return the updated invitation as a DTO
        return InvitationMapper.INSTANCE.invitationToInvitationDTO(updatedInvitation);
    }

    // Reject an invitation - No change needed (still uses invitationId)
    public InvitationDTO rejectInvitation(UUID invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        invitation.setStatus(Invitation.InvitationStatus.REJECTED);
        Invitation updatedInvitation = invitationRepository.save(invitation);
        return InvitationMapper.INSTANCE.invitationToInvitationDTO(updatedInvitation);
    }

    public List<PendingInvitationDTO> getPendingInvitationsForUser(UUID receiverId) {
        return invitationRepository.findByReceiverIdAndStatus(receiverId);
    }

}
