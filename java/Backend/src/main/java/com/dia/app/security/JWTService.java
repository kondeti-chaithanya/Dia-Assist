//package com.dia.app.security;
//
//import com.dia.app.entity.User;
//import com.dia.app.repository.UserRepository;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.SecretKey;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//@AllArgsConstructor
//public class JWTService {
//
//    private final UserRepository userRepository;
//    private final SecretKey secretKey;
//    private final long JwtExpiration;
//
//    private static final String SECRET_KEY = "mySuperSecretKeyForJwtWhichIsAtLeast32BytesLong";
//
//    private final SecretKey SECRET = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
//
//    private static final long JWT_EXPIRATION = 1000L * 60 * 60 * 24; // 24 hours
//
//    // Generating the token here
//    public String generateToken(String email, Long userId) {
//
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("id", userId);
//
//        return Jwts.builder()
//                .setClaims(claims) //adds custom data
//                .setSubject(email) //identify the user
//                .setIssuedAt(new Date()) //token creation time
//                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) //Token expiry
//                .signWith(SECRET) //signs token eith secret key
//                .compact(); //generates final jwt string
//    }
//
//
//    //Validating here and this is used inside the jwt filter
//    public String extractEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(SECRET) // SAME KEY
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    //Loading the user and this is also using inside JwtFilter
//    public CustomUserDetails loadUserByEmail(String email) {
//        User user = userRepository.findByEmail(email);
//
//        if (user == null) {
//            throw new RuntimeException("User not found: " + email);
//        }
//
//        return new CustomUserDetails(user);
//    }
//}

package com.dia.app.security;

import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {

    private final UserRepository userRepository;
    private final SecretKey secretKey;
    private final long jwtExpiration;

    // Injecting secret and expiration from application.properties
    public JWTService(
            UserRepository userRepository,
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long jwtExpiration
    ) {
        this.userRepository = userRepository;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpiration = jwtExpiration;
    }

    // Generating the token here
    public String generateToken(String email, Long userId) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userId);

        return Jwts.builder()
                .setClaims(claims) // adds custom data
                .setSubject(email) // identify the user
                .setIssuedAt(new Date()) // token creation time
                .setExpiration(
                        new Date(System.currentTimeMillis() + jwtExpiration)
                ) // Token expiry
                .signWith(secretKey) // signs token with secret key
                .compact(); // generates final jwt string
    }

    // Validating here and this is used inside the jwt filter
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey) // SAME KEY
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Loading the user and this is also using inside JwtFilter
    public CustomUserDetails loadUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found: " + email);
        }

        return new CustomUserDetails(user);
    }
}
