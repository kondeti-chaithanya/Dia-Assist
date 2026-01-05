package com.dia.app.service;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;

import java.util.List;

public interface PredictionService {

    PredictionResponseDTO predictAndGenerateDiet(
            PredictionRequestDTO request,
            User user
    );

    Prediction getPrediction(Long id);

    List<PredictionHistoryDTO> getPredictionHistory(Long userId);
}
