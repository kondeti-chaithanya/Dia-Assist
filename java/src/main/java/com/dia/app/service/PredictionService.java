package com.dia.app.service;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;

import java.util.List;
import java.util.Map;

public interface PredictionService {

    PredictionResponseDTO predictAndGenerateDiet(PredictionRequestDTO request, User user,String authHeader);

    Prediction getPrediction(Long id);

    List<PredictionHistoryDTO> getPredictionHistory(Long userId);

    Map<String, Object> callPythonPrediction(
            Map<String, Object> request,
            String token
    );

}
