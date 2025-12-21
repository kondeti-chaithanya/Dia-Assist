//package com.dia.app.service.impl;
//
//import com.dia.app.dto.DietPlanRequestDTO;
//import com.dia.app.dto.DietPlanResponseDTO;
//import com.dia.app.entity.DietPlan;
//import com.dia.app.exceptions.ResourceNotFoundException;
//import com.dia.app.repository.DietPlanRepository;
//import com.dia.app.service.DietPlanService;
//import com.dia.app.service.PythonService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//
//@Service
//public class DietPlanServiceImpl implements DietPlanService {
//
//    @Autowired
//    private DietPlanRepository dietPlanRepository;
//
//    @Autowired
//    private PythonService pythonService;
//
//    @Override
//    public DietPlan saveDietPlan(DietPlanRequestDTO request) {
//
//        // Call Python API
//        DietPlanResponseDTO pythonResponse =
//                pythonService.getDietPlan(
//                        request.getMessage(),
//                        request.getPrediction()
//                );
//
//        DietPlan plan = new DietPlan();
//        plan.setBreakfast(pythonResponse.getBreakfast());
//        plan.setLunch(pythonResponse.getLunch());
//        plan.setDinner(pythonResponse.getDinner());
//        plan.setPredictionResult(request.getPrediction());
//        plan.setCreatedAt(LocalDateTime.now());
//
//        return dietPlanRepository.save(plan);
//    }
//
//    @Override
//    public DietPlan saveDietPlan(DietPlan dietPlan) {
//        return null;
//    }
//
//    @Override
//    public DietPlan getDietPlanByUser(Long userId) {
//        return dietPlanRepository
//                .findByUserId(userId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Diet Plan not found for user id: " + userId
//                        ));
//    }
//}
