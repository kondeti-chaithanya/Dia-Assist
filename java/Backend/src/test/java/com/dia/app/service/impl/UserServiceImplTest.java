package com.dia.app.service.impl;

import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.security.JWTService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JWTService jwtService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void register_savesUser_andReturnsMessage() {
        User user = new User();
        user.setEmail("a@b.com");
        user.setName("Test");
        user.setPassword("plainpass");

        when(repo.save(any(User.class))).thenReturn(user);

        String result = userService.register(user);

        assertEquals("Register Successful", result);
        verify(repo, times(1)).save(any(User.class));
    }

    @Test
    void login_success_returnsTokenAndUser() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "mypassword";
        String encoded = encoder.encode(raw);

        User user = new User();
        user.setId(42L);
        user.setEmail("me@example.com");
        user.setName("Me");
        user.setPassword(encoded);

        when(repo.findByEmail("me@example.com")).thenReturn(user);

        var resp = userService.login("me@example.com", raw);

        assertNotNull(resp);
        assertEquals(user.getId(), resp.getId());
        assertEquals(user.getEmail(), resp.getEmail());
    }

    @Test
    void login_invalidEmail_throws() {
        when(repo.findByEmail("noone@example.com")).thenReturn(null);

        assertThrows(RuntimeException.class, () -> userService.login("noone@example.com", "x"));
    }

    @Test
    void login_invalidPassword_throws() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = new User();
        user.setEmail("u@x.com");
        user.setPassword(encoder.encode("rightpass"));

        when(repo.findByEmail("u@x.com")).thenReturn(user);

        assertThrows(RuntimeException.class, () -> userService.login("u@x.com", "wrongpass"));
    }
}
