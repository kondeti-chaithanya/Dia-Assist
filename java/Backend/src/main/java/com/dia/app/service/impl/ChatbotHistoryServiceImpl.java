package com.dia.app.service.impl;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.entity.ChatbotHistory;
import com.dia.app.exceptions.ResourceNotFoundException;
import com.dia.app.repository.ChatbotHistoryRepository;
import com.dia.app.service.ChatbotHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatbotHistoryServiceImpl implements ChatbotHistoryService {

    @Autowired
    private ChatbotHistoryRepository chatbotHistoryRepository;

    @Override
    public ChatbotHistory saveHistory(ChatbotHistory history) {
        return chatbotHistoryRepository.save(history);
    }

    @Override
    public ChatbotHistory getHistoryByUser(Long userId) {
        return chatbotHistoryRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Chat history not found for id: " + userId));
    }
}
