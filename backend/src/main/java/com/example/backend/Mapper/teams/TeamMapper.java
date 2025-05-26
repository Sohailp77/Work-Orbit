package com.example.backend.Mapper.teams;


import com.example.backend.Entity.teams.Team;
import com.example.backend.dto.teams.TeamDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;


@Mapper
public interface TeamMapper {
    TeamMapper INSTANCE = Mappers.getMapper(TeamMapper.class);

//    TeamDTO teamToTeamDTO(Team team);
//
//    Team teamDTOToTeam(TeamDTO teamDTO);

    // Map the Team entity to TeamDTO
    @Mapping(source = "team.createdBy.id", target = "createdById")
    TeamDTO teamToTeamDTO(Team team);

    // Map the TeamDTO back to Team entity
    Team teamDTOToTeam(TeamDTO teamDTO);
}
