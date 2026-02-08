package com.aicode.backend.controller;

import com.aicode.backend.dto.CreateReviewRequest;
import com.aicode.backend.model.Job;
import com.aicode.backend.service.JobExecutor;
import com.aicode.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final JobService jobService;
    private final JobExecutor jobExecutor;

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody CreateReviewRequest request) {

        Job job = jobService.createJob(
                "REVIEW",
                request.getCode()   // store actual code
        );

        jobExecutor.executeReviewJob(job.getJobId());

        return ResponseEntity.accepted().body(
                Map.of(
                        "jobId", job.getJobId(),
                        "status", job.getStatus()
                )
        );
    }
}