package com.dia.app.controller;

import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prediction")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PredictionResponseDTO> predict(
            @RequestBody PredictionRequestDTO request,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                predictionService.predictAndGenerateDiet(request, user)
        );
    }




    //    // Get a single prediction
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getPrediction(@PathVariable Long id) {
//        Prediction prediction = predictionService.getPrediction(id);
//        return ResponseEntity.ok(prediction);
//    }
//
    // Get prediction history
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                predictionService.getPredictionHistory(userDetails.getId())
        );
    }


}
