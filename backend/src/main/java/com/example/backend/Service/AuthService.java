package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import com.example.backend.dto.Auth.AuthResponse;
import com.example.backend.dto.Auth.RegisterRequest;
import com.example.backend.dto.Auth.LoginRequest;
import com.example.backend.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // For now we just return the user. Later we will return token too.
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash password
        user.setFirstName(request.getFirstName());

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token after successful login
        String token = jwtService.generateToken(user.getId(), user.getEmail());

        // Return AuthResponse with the token
        return new AuthResponse(token, user.getEmail(), user.getId());
    }



    public List<UserDTO> getAllUsers(UUID teamId) {
        // Fetch all users and filter out those who are part of the specified team
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> !isUserPartOfTeam(user, teamId)) // Filter out users part of the team
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setFirstName(user.getFirstName());
                    dto.setEmail(user.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Helper method to check if the user is part of the specified team
    private boolean isUserPartOfTeam(User user, UUID teamId) {
        // Check if user is part of the team using the teamMemberships list
        return user.getTeamMemberships().stream()
                .anyMatch(teamMember -> teamMember.getTeam().getId().equals(teamId));
    }


}
