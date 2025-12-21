package com.dia.app.dto;

import lombok.Data;
import java.util.List;

@Data
public class PredictionRequestDTO {

    private int age;
    private String gender;
    private String smoking_history;
    private double bmi;
    private double HbA1c_level;
    private int blood_glucose_level;
    private int hypertension;
    private int heart_disease;
    private List<String> other_diseases;
}
