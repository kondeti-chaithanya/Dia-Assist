package com.dia.app.controller;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.entity.ChatbotHistory;
import com.dia.app.service.ChatbotHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatbotHistoryController {

    @Autowired
    private ChatbotHistoryService chatbotHistoryService;

    @PostMapping("/save")
    public ResponseEntity<ChatbotHistory> save(@RequestBody ChatbotHistory history) {
        return ResponseEntity.ok(chatbotHistoryService.saveHistory(history));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ChatbotHistory> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(chatbotHistoryService.getHistoryByUser(userId));
    }

}
