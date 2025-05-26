package com.example.backend.Mapper.teams;

import com.example.backend.Entity.teams.TeamMember;
import com.example.backend.dto.teams.TeamMemberDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TeamMemberMapper {
    TeamMemberMapper INSTANCE = Mappers.getMapper(TeamMemberMapper.class);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "userName") // <-- map user's name
    TeamMemberDTO teamMemberToTeamMemberDTO(TeamMember teamMember);
}
