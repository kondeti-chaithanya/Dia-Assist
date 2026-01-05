package com.dia.app.controller;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.PredictionService;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prediction")
@AllArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PredictionResponseDTO> predict(@RequestBody PredictionRequestDTO request, Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        //get logged in user email
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        PredictionResponseDTO response = predictionService.predictAndGenerateDiet(request, user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PredictionHistoryDTO>> getHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(predictionService.getPredictionHistory(userDetails.getId()));
    }
}

