package com.dia.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.dto.PredictionRequestDTO;
import com.dia.app.dto.PredictionResponseDTO;
import com.dia.app.entity.Prediction;
import com.dia.app.entity.User;
import com.dia.app.repository.PredictionRepository;
import com.dia.app.service.PredictionService;
import com.dia.app.service.PythonClientService;
import com.dia.app.service.PythonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PredictionServiceImpl implements PredictionService {

    @Autowired
    private PythonService pythonService;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private PythonClientService pythonClientService;

    @Override
    public PredictionResponseDTO predictAndGenerateDiet(PredictionRequestDTO request, User user, String authHeader) {

        Map<String, Object> response = pythonService.predict(request, authHeader);

        if (response == null || !response.containsKey("prediction") || !response.containsKey("diet_plan")) {
            throw new RuntimeException("Invalid Python response: " + response);
        }

        Integer predictionValue = (Integer) response.get("prediction");

        @SuppressWarnings("unchecked")
        Map<String, Object> dietPlan = (Map<String, Object>) response.get("diet_plan");

        String message = response.containsKey("message") ? String.valueOf(response.get("message")) : null;

        String whyThisResult = response.containsKey("why_this_result") ? String.valueOf(response.get("why_this_result")) : null;

        // Save to DB
        Prediction prediction = new Prediction();
        prediction.setBloodGlucose(request.getBlood_glucose_level());
        prediction.setBmi(request.getBmi());
        prediction.setHba1c(request.getHbA1c_level());
        prediction.setResult(String.valueOf(predictionValue));
        prediction.setWhy_this_result(message);
        prediction.setDietPlan(dietPlan.toString());
        prediction.setUser(user);
        prediction.setCreatedAt(LocalDateTime.now());
        predictionRepository.save(prediction);

        // Send response to frontend
        PredictionResponseDTO dto = new PredictionResponseDTO();
        dto.setPrediction(predictionValue);
        dto.setMessage(message);
        dto.setWhy_this_result(whyThisResult);
        dto.setDiet_plan(dietPlan);

        return dto;
    }

    @Override
    public Prediction getPrediction(Long id) {
        return predictionRepository.findById(id).orElse(null);
    }

    @Override
    public List<PredictionHistoryDTO> getPredictionHistory(Long userId) {
        return predictionRepository.findHistoryByUserId(userId);
    }

    @Override
    public Map<String, Object> callPythonPrediction(
            Map<String, Object> request,
            String token
    ) {
        return pythonClientService.callPython(request, token);
    }

}
