package com.dia.app.service.impl;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ChatbotServiceImpl chatbotService;

    @Test
    void askChatbot_returnsResponseBody() {
        ChatResponseDTO body = new ChatResponseDTO();
        body.setAnswer("hello");

        ResponseEntity<ChatResponseDTO> resp = ResponseEntity.ok(body);

        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(ChatResponseDTO.class)))
                .thenReturn(resp);

        ChatResponseDTO out = chatbotService.askChatbot("what", "authX");

        assertNotNull(out);
        assertEquals("hello", out.getAnswer());
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(ChatResponseDTO.class));
    }
}
