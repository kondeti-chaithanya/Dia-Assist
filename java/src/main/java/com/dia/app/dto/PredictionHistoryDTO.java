package com.dia.app.dto;

import java.time.LocalDateTime;

public record PredictionHistoryDTO(
        LocalDateTime date,
        String result,
        Integer bloodGlucose,
        Double bmi,
        Double hba1c
) {}
