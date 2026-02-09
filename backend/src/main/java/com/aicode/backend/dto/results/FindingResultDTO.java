package com.aicode.backend.dto.results;

import java.util.UUID;

public record FindingResultDTO(
        UUID findingId,
        String severity,
        String tool,
        String message,
        AiResultDTO ai
) {}
