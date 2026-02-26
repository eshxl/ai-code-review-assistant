package com.aicode.backend.dto;

import lombok.Data;

@Data
public class AiReviewResponse {

    private String explanation;
    private String patch;
    private Double confidence;

    private String originalCode;
    private String fixedCode;
}