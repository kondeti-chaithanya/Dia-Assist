package com.dia.app.controller;

import com.dia.app.dto.UserResponseDTO;
import com.dia.app.entity.User;
import com.dia.app.security.JWTService;
import com.dia.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;

    //Login
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody User user) {

        //Validate credentials
        UserResponseDTO userDto = userService.login(user.getEmail(), user.getPassword());

        String token = jwtService.generateToken(userDto.getEmail(), userDto.getId());

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Strict")
                .maxAge(Duration.ofHours(24))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(userDto);
    }

    //Register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    //Logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {

        // Authentication is set by JWTFilter
        String email = authentication.getName();


        User user = userService.findByEmail(email);

        UserResponseDTO dto = new UserResponseDTO(user.getId(), user.getName(), user.getEmail());

        return ResponseEntity.ok(dto);
    }

}
