package com.aicode.backend.controller;

import com.aicode.backend.dto.JobStatusResponse;
import com.aicode.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/{jobId}")
    public ResponseEntity<JobStatusResponse> getJobStatus(
            @PathVariable UUID jobId
    ) {
        JobStatusResponse response = jobService.getJobStatus(jobId);
        return ResponseEntity.ok(response);
    }
}