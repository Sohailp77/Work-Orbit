package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.AuthService;
import com.example.backend.dto.Auth.AuthResponse;
import com.example.backend.dto.Auth.LoginRequest;
import com.example.backend.dto.Auth.RegisterRequest;
import com.example.backend.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); // Logger for this class

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(user);
    }

//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//        AuthResponse response = authService.login(request);
//        return ResponseEntity.ok(response); // Return JWT token with user info
//    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        logger.info("Received login request for email: {}", request.getEmail());

        try {
            // Call AuthService to process login
            AuthResponse response = authService.login(request);

            // Log successful login
            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response); // Return JWT token with user info
        } catch (Exception e) {
            // Log failure (invalid credentials, user not found, etc.)
            logger.error("Login failed for email: {}. Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return Forbidden status
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsersNotInTeam(@RequestParam UUID teamId) {
        List<UserDTO> users = authService.getAllUsers(teamId);
        return ResponseEntity.ok(users);
    }



}
