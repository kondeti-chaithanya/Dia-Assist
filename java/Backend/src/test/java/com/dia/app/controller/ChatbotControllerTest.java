package com.dia.app.controller;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.ChatbotService;
import com.dia.app.entity.User;
import org.springframework.security.core.Authentication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotControllerTest {

    @Mock
    private ChatbotService chatbotService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ChatbotController chatbotController;

    @Test
    void chat_returnsAnswer() {
        ChatResponseDTO resp = new ChatResponseDTO();
        resp.setAnswer("ok");

        // Create a mock user and CustomUserDetails
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        mockUser.setPassword("password");

        CustomUserDetails userDetails = new CustomUserDetails(mockUser);

        when(chatbotService.askChatbot(anyString(), anyString())).thenReturn(resp);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        ChatRequestDTO req = new ChatRequestDTO();
        req.setQuestion("hi");

        var response = chatbotController.chat(req, authentication);

        assertEquals(resp, response.getBody());
    }
}
