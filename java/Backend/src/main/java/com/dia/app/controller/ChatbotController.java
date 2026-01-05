package com.dia.app.controller;

import com.dia.app.dto.ChatRequestDTO;
import com.dia.app.dto.ChatResponseDTO;
import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.ChatbotService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@AllArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request, Authentication authentication) {

        //checks user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        //Extract real database userId from JWT
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails userDetails)) {
            return ResponseEntity.status(401).build();
        }

        String userId = userDetails.getId().toString();

        //Call chatbot service
        ChatResponseDTO response = chatbotService.askChatbot(request.getQuestion(), userId);

        return ResponseEntity.ok(response);
    }
}

