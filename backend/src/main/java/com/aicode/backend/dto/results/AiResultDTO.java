package com.aicode.backend.dto.results;

public record AiResultDTO(
        String explanation,
        String patch,
        double confidence
) {}
