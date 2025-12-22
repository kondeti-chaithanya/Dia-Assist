package com.dia.app.security;

import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

    @Autowired
    private UserRepository userRepository;

    private static final String SECRET_KEY =
            "mySuperSecretKeyForJwtWhichIsAtLeast32BytesLong";

    private final SecretKey SECRET =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    private static final long JWT_EXPIRATION =
            1000L * 60 * 60 * 24; // 24 hours

    // GENERATE TOKEN
    public String generateToken(String email, Long userId) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + JWT_EXPIRATION)
                )
                .signWith(SECRET)
                .compact();
    }


    //VALIDATE TOKEN
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET) // SAME KEY
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // LOAD USER
    public CustomUserDetails loadUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found: " + email);
        }

        return new CustomUserDetails(user);
    }
}
