package com.dia.app.service;

import com.dia.app.dto.DietPlanRequestDTO;
import com.dia.app.entity.DietPlan;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DietPlanService {

    public DietPlan saveDietPlan(DietPlan dietPlan);

    public DietPlan getDietPlanByUser(Long userId);

    public DietPlan saveDietPlan(DietPlanRequestDTO request);
}
