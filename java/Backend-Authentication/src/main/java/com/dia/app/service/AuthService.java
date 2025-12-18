package com.dia.app.service;

import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.security.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repo;
    private final JWTService jwt;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return "Register Sucessful";
    }

    public String login(String email, String password){

        User user = repo.findByEmail(email);

        if (user == null)
            throw new RuntimeException("Invalid credentials");

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        return jwt.geterateToken(email);
    }
}
