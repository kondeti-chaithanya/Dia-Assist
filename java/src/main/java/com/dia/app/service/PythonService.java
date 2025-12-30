package com.dia.app.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PythonService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String PREDICT_URL = "http://localhost:8000/predict_and_diet";

    public Map<String, Object> predict(Object request, String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("Authorization",authHeader);

        HttpEntity<Object> entity = new HttpEntity<>(request, headers);
        return restTemplate.postForObject(
                "http://localhost:8000/predict_and_diet",
                entity,
                Map.class
        );
    }
}
