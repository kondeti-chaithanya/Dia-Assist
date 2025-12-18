package com.dia.app.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JWTService {
    private final SecretKey SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long JWT_EXPIRATION = 1000L * 60 * 60 * 24;
    public String geterateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SECRET)
                .compact();
    }
    public String extractEmail(String token) {
        return Jwts.parserBuilder() //It is a tool to read and verify JWT tokens
                .setSigningKey(SECRET) //Used to verify signature
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

}
