package com.dia.app.service.impl;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.service.ChatbotService;
import com.dia.app.service.PythonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final PythonService pythonService;

    @Override
    public ChatResponseDTO askChatbot(String question, String userId) {

        ChatRequestDTO request = new ChatRequestDTO();
        request.setQuestion(question);

        return pythonService.chat(
                request,
                userId,
                ChatResponseDTO.class
        );
    }
}
