package com.dia.app.service.impl;

import com.dia.app.entity.Prediction;
import com.dia.app.repository.PredictionRepository;
import com.dia.app.service.GraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GraphServiceImpl implements GraphService {

    private final PredictionRepository predictionRepository;

    @Override
    public List<Map<String, Object>> getLastSeenChecks(Long userId) {

        // 1️⃣ Fetch last 7 predictions
        List<Prediction> predictions =
                predictionRepository.findTop7ByUser_IdOrderByCreatedAtDesc(userId);

        // 2️⃣ Reverse so oldest → newest
        Collections.reverse(predictions);

        // 3️⃣ Prepare graph data
        List<Map<String, Object>> result = new ArrayList<>();

        int count = 1;
        for (Prediction p : predictions) {
            Map<String, Object> map = new HashMap<>();
            map.put("check", "Check " + count++);
            map.put("hba1c", p.getHba1c());
            map.put("glucose", p.getBloodGlucose());
            result.add(map);
        }

        return result;
    }
}
