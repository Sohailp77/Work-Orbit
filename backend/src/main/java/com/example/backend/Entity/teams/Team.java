//package com.example.backend.Entity.teams;
//
//import com.example.backend.Entity.Task.Task;
//import com.example.backend.Entity.User;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//
//import java.util.List;
//import java.util.UUID;
//
//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Table(name = "team")
//public class Team {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @Column(nullable = false)
//    private String name;
//
//    private String description;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by_id", nullable = false)
//    private User createdBy;
//
//    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
//    private List<TeamMember> members;
//
//    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
//    private List<Task> tasks;
//}

package com.example.backend.Entity.teams;

import com.example.backend.Entity.Invitation.Invitation;
import com.example.backend.Entity.Task.Task;
import com.example.backend.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "team")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> members;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Invitation> invitations; // Add this line
}
