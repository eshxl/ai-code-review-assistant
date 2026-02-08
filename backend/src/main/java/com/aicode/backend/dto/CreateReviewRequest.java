package com.aicode.backend.dto;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private String language;
    private String code;
}