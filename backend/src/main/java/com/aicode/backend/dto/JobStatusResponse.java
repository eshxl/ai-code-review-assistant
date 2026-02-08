package com.aicode.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aicode.backend.model.JobStatus;

@Data
@AllArgsConstructor
public class JobStatusResponse {

    private UUID jobId;
    private String type;
    private JobStatus status;
    private String errorMessage;
    private LocalDateTime updatedAt;
}