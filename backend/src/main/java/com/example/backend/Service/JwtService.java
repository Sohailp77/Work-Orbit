package com.example.backend.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(secret.getBytes());\
//        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(UUID userId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return parseToken(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            // Log or handle expired token exception
            return false;
        } catch (MalformedJwtException e) {
            // Log or handle malformed token exception
            return false;
        } catch (Exception e) {
            return false;
        }
    }


    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    // This method is used to extract user details directly from the token
    public String getUserIdFromToken(String token) {
        return parseToken(token).getBody().get("userId", String.class);
    }
    // Optionally: This method can return the whole User object or a specific UserDetails class
    // if you have such a class. Here, we're returning only the email and userId for simplicity.
    public Map<String, String> getUserDetailsFromToken(String token) {
        Map<String, String> details = new HashMap<>();
        details.put("email", extractEmail(token));
        details.put("userId", getUserIdFromToken(token));
        return details;
    }

}
