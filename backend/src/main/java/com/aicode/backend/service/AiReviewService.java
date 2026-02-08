package com.aicode.backend.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiReviewService {

    private final String AI_SERVICE_URL = "http://127.0.0.1:8000/review/analyze";

    public String getAiFeedback(String codeSnippet, String language) {
        try {
            // Prepare the request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("code_snippet", codeSnippet);
            requestBody.put("language", language);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create the HTTP entity
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
            
            System.out.println(">>> Sending request to AI Service at: " + AI_SERVICE_URL);

            // Use RestTemplate to send POST request
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(AI_SERVICE_URL, entity, Map.class);
            System.out.println(">>> Received response: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("feedback");
            } else {
                return "AI service did not return a valid response.";
            }

        } catch (HttpClientErrorException e) {
            return "Error from AI service: " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error connecting to AI service: " + e.getMessage();
        }
    }
}