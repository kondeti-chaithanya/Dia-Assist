package com.dia.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PythonService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${python.base.url}")
    private String pythonBaseUrl;

    public Map<String, Object> predict(Object request, String userId) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("X-User-Id", userId);

        HttpEntity<Object> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForObject(pythonBaseUrl + "/predict_and_diet", entity, Map.class);
    }

    public <T> T chat(Object request, String userId, Class<T> responseType) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-Id", userId);

        HttpEntity<Object> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForObject(
                pythonBaseUrl + "/chat",
                entity,
                responseType
        );
    }

}

