package com.dia.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PredictionHistoryDTO {

    private LocalDateTime date;
    private String result;
    private Integer bloodGlucose;
    private Double bmi;
    private Double hba1c;
}
