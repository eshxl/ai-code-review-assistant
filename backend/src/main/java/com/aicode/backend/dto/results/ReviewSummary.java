package com.aicode.backend.dto.results;

public record ReviewSummary(
        int critical,
        int high,
        int medium,
        int low
) {}
