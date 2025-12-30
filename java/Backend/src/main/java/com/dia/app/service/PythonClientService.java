package com.dia.app.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@Service
public class PythonClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> callPython(
            Map<String, Object> requestBody,
            String jwtToken
    ) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 🔑 THIS IS THE KEY LINE
        headers.set("Authorization", jwtToken);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        "http://localhost:8000/predict",
                        entity,
                        Map.class
                );

        return response.getBody(); // EXACT Python response
    }
}
