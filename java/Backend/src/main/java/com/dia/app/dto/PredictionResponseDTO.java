package com.dia.app.dto;

import lombok.Data;
import java.util.Map;

@Data
public class PredictionResponseDTO {

    private Integer prediction;
    private String message;
    private String why_this_result;

    // FULL diet plan (nested JSON)
    private Map<String, Object> diet_plan;
}
