package com.dia.app.service;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.entity.ChatbotHistory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChatbotHistoryService {

    public ChatbotHistory saveHistory(ChatbotHistory history);

    public ChatbotHistory getHistoryByUser(Long userId);

}
