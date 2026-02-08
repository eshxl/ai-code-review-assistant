package com.aicode.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AiReviewRequest {

    private String language;
    private String code;
    private List<Map<String, String>> findings;
}