package com.dia.app.service.impl;

import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;
import com.dia.app.repository.PredictionRepository;
import com.dia.app.service.PythonClientService;
import com.dia.app.service.PythonService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceImplTest {

    @Mock
    private PythonService pythonService;

    @Mock
    private PredictionRepository predictionRepository;

    @Mock
    private PythonClientService pythonClientService;

    @InjectMocks
    private PredictionServiceImpl predictionService;

    @Test
    void predictAndGenerateDiet_savesPrediction_andReturnsDto() {
        PredictionRequestDTO req = new PredictionRequestDTO();
        req.setBlood_glucose_level(120);
        req.setBmi(22.5);
        req.setHbA1c_level(5.4);

        User user = new User();
        user.setId(7L);

        Map<String, Object> pythonResp = new HashMap<>();
        pythonResp.put("prediction", 1);
        Map<String, Object> diet = new HashMap<>();
        diet.put("breakfast", "oats");
        pythonResp.put("diet_plan", diet);
        pythonResp.put("message", "ok");
        pythonResp.put("why_this_result", "reason");

        when(pythonService.predict(any(), anyString())).thenReturn(pythonResp);
        when(predictionRepository.save(any(Prediction.class))).thenAnswer(inv -> inv.getArgument(0));

        PredictionResponseDTO dto = predictionService.predictAndGenerateDiet(req, user, "authTok");

        assertNotNull(dto);
        assertEquals(1, dto.getPrediction());
        assertEquals("ok", dto.getMessage());
        assertEquals("reason", dto.getWhy_this_result());

        ArgumentCaptor<Prediction> captor = ArgumentCaptor.forClass(Prediction.class);
        verify(predictionRepository).save(captor.capture());
        Prediction saved = captor.getValue();
        assertEquals(user, saved.getUser());
        assertEquals(Integer.valueOf(120), saved.getBloodGlucose());
    }

    @Test
    void getPrediction_returnsWhenPresent() {
        Prediction p = new Prediction();
        p.setId(11L);

        when(predictionRepository.findById(11L)).thenReturn(Optional.of(p));

        assertEquals(p, predictionService.getPrediction(11L));
    }

    @Test
    void getPredictionHistory_delegatesToRepository() {
        List empty = Collections.emptyList();
        when(predictionRepository.findHistoryByUserId(3L)).thenReturn(empty);

        assertSame(empty, predictionService.getPredictionHistory(3L));
    }

    @Test
    void callPythonPrediction_delegatesToClient() {
        Map<String,Object> req = Map.of("a", 1);
        Map<String,Object> resp = Map.of("x", 2);
        when(pythonClientService.callPython(req, "t")).thenReturn(resp);

        assertEquals(resp, predictionService.callPythonPrediction(req, "t"));
    }
}
