package com.aicode.backend.service;

import com.aicode.backend.dto.AiReviewRequest;
import com.aicode.backend.dto.AiReviewResponse;
import com.aicode.backend.model.Finding;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiReviewService {

    private final WebClient aiWebClient;

    public AiReviewResponse analyze(
            String language,
            String sourceCode,
            List<Finding> findings
    ) {

        AiReviewRequest request = new AiReviewRequest(
                language,
                sourceCode,
                findings.stream().map(f -> Map.of(
                        "type", f.getSeverity(),
                        "message", f.getMessage()
                )).toList()
        );

        return aiWebClient.post()
                .uri("/review/ai")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiReviewResponse.class)
                .block();
    }
}
