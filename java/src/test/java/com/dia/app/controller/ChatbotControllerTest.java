package com.dia.app.controller;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.service.ChatbotService;
import jakarta.servlet.http.HttpServletRequest;
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
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private ChatbotController chatbotController;

    @Test
    void chat_returnsAnswer() {
        ChatResponseDTO resp = new ChatResponseDTO();
        resp.setAnswer("ok");

        when(chatbotService.askChatbot(anyString(), anyString())).thenReturn(resp);
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer tkn");

        ChatRequestDTO req = new ChatRequestDTO();
        req.setQuestion("hi");

        var response = chatbotController.chat(req, httpServletRequest);

        assertEquals(resp, response.getBody());
    }
}
