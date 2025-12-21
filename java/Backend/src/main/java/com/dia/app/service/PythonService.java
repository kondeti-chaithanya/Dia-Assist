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

    public Map<String, Object> predict(Object request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(request, headers);
        return restTemplate.postForObject(
                "http://localhost:8000/predict_and_diet",
                entity,
                Map.class
        );
    }


//    public Map<String, Object> predict(Object request) {
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON); // Important!
//        // If Python requires authentication, add it here:
//        // headers.set("Authorization", "Bearer <token>");
//
//        HttpEntity<Object> entity = new HttpEntity<>(request, headers);
//
//        return restTemplate.postForObject(PREDICT_URL, entity, Map.class);
//    }
}
