package com.dia.app.service.impl;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.service.ChatbotService;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final RestTemplate restTemplate;

    @Override
    public ChatResponseDTO askChatbot(String question, String authHeader) {

        String pythonUrl = "http://localhost:8000/chat";

        ChatRequestDTO request = new ChatRequestDTO();
        request.setQuestion(question);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("Authorization", authHeader);

        HttpEntity<ChatRequestDTO> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ChatResponseDTO> response =
                restTemplate.exchange(
                        pythonUrl,
                        HttpMethod.POST,
                        entity,
                        ChatResponseDTO.class
                );

        return response.getBody();
    }
}
