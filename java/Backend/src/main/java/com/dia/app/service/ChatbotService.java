package com.dia.app.service;

import com.dia.app.dto.ChatResponseDTO;
import org.springframework.stereotype.Service;

@Service
public interface ChatbotService {
    public ChatResponseDTO askChatbot(String question, String authHeader);
}
