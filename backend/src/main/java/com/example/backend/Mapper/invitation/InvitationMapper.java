package com.example.backend.Mapper.invitation;

import com.example.backend.Entity.Invitation.Invitation;
import com.example.backend.dto.invitation.InvitationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface InvitationMapper {
    InvitationMapper INSTANCE = Mappers.getMapper(InvitationMapper.class);

    @Mapping(source = "team.id", target = "teamId")
    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "receiver.id", target = "receiverId")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "sender.firstName", target = "senderName")
    InvitationDTO invitationToInvitationDTO(Invitation invitation);

    @Mapping(source = "teamId", target = "team.id")
    @Mapping(source = "senderId", target = "sender.id")
    @Mapping(source = "receiverId", target = "receiver.id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdAt", target = "createdAt")
    Invitation invitationDTOToInvitation(InvitationDTO invitationDTO);

    // Custom method to convert InvitationStatus enum to String
    default String map(Invitation.InvitationStatus status) {
        return status == null ? null : status.name();
    }

    // Custom method to convert String to InvitationStatus enum
    default Invitation.InvitationStatus map(String status) {
        return status == null ? null : Invitation.InvitationStatus.valueOf(status);
    }
}
