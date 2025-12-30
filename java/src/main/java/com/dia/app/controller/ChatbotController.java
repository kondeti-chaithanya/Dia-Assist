package com.dia.app.controller;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.service.ChatbotService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request, HttpServletRequest httpRequest) {

        String authHeader = httpRequest.getHeader("Authorization");

        ChatResponseDTO response = chatbotService.askChatbot(request.getQuestion(), authHeader);
        return ResponseEntity.ok(response);
    }
}
