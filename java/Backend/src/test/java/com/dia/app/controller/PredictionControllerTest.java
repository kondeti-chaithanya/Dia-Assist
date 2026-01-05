package com.dia.app.controller;

import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.service.PredictionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PredictionControllerTest {

    @Mock
    private PredictionService predictionService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PredictionController predictionController;

    @Test
    void predict_requiresAuthentication() {
        PredictionRequestDTO req = new PredictionRequestDTO();
        req.setBloodGlucoseLevel(120);

        var resp = predictionController.predict(req, null);
        assertEquals(HttpStatus.UNAUTHORIZED, resp.getStatusCode());
    }

    @Test
    void predict_withAuthentication_callsService() {
        PredictionRequestDTO req = new PredictionRequestDTO();
        req.setBloodGlucoseLevel(120);

        User u = new User();
        u.setId(5L);
        u.setEmail("me@example.com");

        when(userRepository.findByEmail("me@example.com")).thenReturn(u);

        PredictionResponseDTO dto = new PredictionResponseDTO();
        dto.setPrediction(1);

        when(predictionService.predictAndGenerateDiet(any(), any())).thenReturn(dto);

        // create a simple Authentication mock
        var auth = org.mockito.Mockito.mock(org.springframework.security.core.Authentication.class);
        when(auth.getName()).thenReturn("me@example.com");

        var resp = predictionController.predict(req, auth);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
    }
}
