package com.dia.app.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String breakfast;
    private String lunch;
    private String dinner;

    private String predictionResult;
    private LocalDateTime createdAt;

    @ManyToOne
    private User user;
}
