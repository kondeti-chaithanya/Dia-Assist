package com.dia.app.service.impl;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;
import com.dia.app.repository.PredictionRepository;
import com.dia.app.service.PredictionService;
import com.dia.app.service.PythonService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final PythonService pythonService;

    private final PredictionRepository predictionRepository;

    public PredictionResponseDTO predictAndGenerateDiet(PredictionRequestDTO request, User user) {

        //Send userId to Python
        Map<String, Object> response = pythonService.predict(request, user.getId().toString());

        if (response == null || !response.containsKey("prediction") || !response.containsKey("diet_plan")) {
            throw new RuntimeException("Invalid Python response: " + response);
        }

        Integer predictionValue = (Integer) response.get("prediction");

        Map<String, Object> dietPlan = (Map<String, Object>) response.get("diet_plan");

        String message = response.containsKey("message") ? String.valueOf(response.get("message")) : null;

        String whyThisResult = response.containsKey("why_this_result") ? String.valueOf(response.get("why_this_result")) : null;

        // Save to DB
        Prediction prediction = new Prediction();
        prediction.setBloodGlucose(request.getBlood_glucose_level());
        prediction.setBmi(request.getBmi());
        prediction.setHba1c(request.getHbA1c_level());
        prediction.setResult(String.valueOf(predictionValue));
        prediction.setWhyThisResult(whyThisResult);
        prediction.setDietPlan(dietPlan.toString());
        prediction.setUser(user);
        prediction.setCreatedAt(LocalDateTime.now());

        predictionRepository.save(prediction);

        PredictionResponseDTO dto = new PredictionResponseDTO();
        dto.setPrediction(predictionValue);
        dto.setMessage(message);
        dto.setWhy_this_result(whyThisResult);
        dto.setDiet_plan(dietPlan);

        return dto;
    }

    @Override
    public List<PredictionHistoryDTO> getPredictionHistory(Long userId) {
        return predictionRepository.findHistoryByUserId(userId);
    }

    @Override
    public Prediction getPrediction(Long id) {
        return predictionRepository.findById(id).orElse(null);
    }
}
