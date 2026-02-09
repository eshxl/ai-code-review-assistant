package com.aicode.backend.dto.results;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ReviewResultsResponse(
        UUID reviewId,
        String status,
        boolean blocked,
        ReviewSummary summary,
        Map<String, List<FindingResultDTO>> findings,
        List<SecurityAlertDTO> securityAlerts
) {}