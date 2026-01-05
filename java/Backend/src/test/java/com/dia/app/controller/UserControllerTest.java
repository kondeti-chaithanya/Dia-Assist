package com.dia.app.controller;

import com.dia.app.dto.UserResponseDTO;
import com.dia.app.entity.User;
import com.dia.app.security.JWTService;
import com.dia.app.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JWTService jwtService;

    @InjectMocks
    private UserController userController;

    @Test
    void login_delegatesToService() {
        User u = new User();
        u.setEmail("a@b.com");
        u.setPassword("p");

        UserResponseDTO dto = new UserResponseDTO(1L, "Test", "a@b.com");
        when(userService.login("a@b.com", "p")).thenReturn(dto);
        when(jwtService.generateToken(dto.getEmail(), dto.getId())).thenReturn("tkn");

        var resp = userController.login(u);
        assertEquals(200, resp.getStatusCode().value());
        assertEquals(dto, resp.getBody());
        // ensure Set-Cookie header is present
        assertNotNull(resp.getHeaders().getFirst(org.springframework.http.HttpHeaders.SET_COOKIE));
    }

    @Test
    void register_callsService() {
        User u = new User();
        u.setEmail("x@x.com");
        u.setPassword("pw");

        when(userService.register(any(User.class))).thenReturn("Register Successful");

        var resp = userController.register(u);
        assertEquals(200, resp.getStatusCode().value());
    }
}
