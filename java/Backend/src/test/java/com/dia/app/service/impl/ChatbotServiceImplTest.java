package com.dia.app.service.impl;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.service.PythonService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceImplTest {

    @Mock
    private PythonService pythonService;   // ✅ CORRECT DEPENDENCY

    @InjectMocks
    private ChatbotServiceImpl chatbotService;

    @Test
    void askChatbot_returnsResponseBody() {

        // Arrange
        ChatResponseDTO mockResponse = new ChatResponseDTO();
        mockResponse.setAnswer("hello");

        when(
                pythonService.chat(
                        any(ChatRequestDTO.class),
                        eq("authX"),
                        eq(ChatResponseDTO.class)
                )
        ).thenReturn(mockResponse);

        // Act
        ChatResponseDTO out = chatbotService.askChatbot("what", "authX");

        // Assert
        assertNotNull(out);
        assertEquals("hello", out.getAnswer());
    }
}
