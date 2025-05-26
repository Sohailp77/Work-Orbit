package com.example.backend.Controller.invitation;

import com.example.backend.Service.invitation.InvitationService;
import com.example.backend.dto.invitation.InvitationDTO;
import com.example.backend.dto.invitation.PendingInvitationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    // Send an invitation
    @PostMapping("/send")
    public ResponseEntity<InvitationDTO> sendInvitation(@RequestBody InvitationDTO invitationDTO) {
        // Call the service to process the invitation
        InvitationDTO createdInvitationDTO = invitationService.sendInvitation(invitationDTO);
        return new ResponseEntity<>(createdInvitationDTO, HttpStatus.CREATED);
    }

    // Get all invitations for a user
//    @GetMapping("/user/{receiverId}")
//    public ResponseEntity<List<InvitationDTO>> getInvitationsForUser(@PathVariable UUID receiverId) {
//        List<InvitationDTO> invitationDTOs = invitationService.getInvitationsForUser(receiverId);
//        return new ResponseEntity<>(invitationDTOs, HttpStatus.OK);
//    }

    @GetMapping("/pending/{receiverId}")
    public List<PendingInvitationDTO> getPendingInvitationsForUser(@PathVariable UUID receiverId) {
        return invitationService.getPendingInvitationsForUser(receiverId);
    }

    // Accept an invitation
    @PutMapping("/accept/{invitationId}")
    public ResponseEntity<InvitationDTO> acceptInvitation(@PathVariable UUID invitationId) {
        InvitationDTO invitationDTO = invitationService.acceptInvitation(invitationId);
        return new ResponseEntity<>(invitationDTO, HttpStatus.OK);
    }

    // Reject an invitation
    @PutMapping("/reject/{invitationId}")
    public ResponseEntity<InvitationDTO> rejectInvitation(@PathVariable UUID invitationId) {
        InvitationDTO invitationDTO = invitationService.rejectInvitation(invitationId);
        return new ResponseEntity<>(invitationDTO, HttpStatus.OK);
    }
}
