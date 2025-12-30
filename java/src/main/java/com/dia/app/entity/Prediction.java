package com.dia.app.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String result; // "1" or "0"
    private Double bmi;
    private Double hba1c;
    private Integer bloodGlucose;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String why_this_result;

    @Column(columnDefinition = "TEXT")
    private String dietPlan;
}
