package com.dia.app.security;

import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JWTServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JWTService jwtService;

    @Test
    void generateAndExtractEmail() {
        String token = jwtService.generateToken("me@test", 12L);
        assertNotNull(token);

        String email = jwtService.extractEmail(token);
        assertEquals("me@test", email);
    }

    @Test
    void loadUserByEmail_success() {
        User u = new User();
        u.setEmail("x@y");
        u.setName("n");
        u.setPassword("p");

        when(userRepository.findByEmail("x@y")).thenReturn(u);

        CustomUserDetails details = jwtService.loadUserByEmail("x@y");
        assertEquals("x@y", details.getUsername());
    }

    @Test
    void loadUserByEmail_notFound_throws() {
        when(userRepository.findByEmail("no@one")).thenReturn(null);

        assertThrows(RuntimeException.class, () -> jwtService.loadUserByEmail("no@one"));
    }
}
