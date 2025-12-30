package com.dia.app.controller;

import com.dia.app.entity.User;
import com.dia.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class UserController {

    private final UserService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        return ResponseEntity.ok(authService.login(user.getEmail(), user.getPassword()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("REGISTER API HIT");
        return ResponseEntity.ok(authService.register(user));
    }
}
