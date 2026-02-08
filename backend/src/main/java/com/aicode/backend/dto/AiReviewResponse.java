package com.aicode.backend.dto;

public record AiReviewResponse(
        String explanation,
        String patch,
        double confidence
) {}
