package com.aicode.backend.controller;

import com.aicode.backend.dto.results.ReviewResultsResponse;
import com.aicode.backend.service.ReviewResultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewResultsController {

    private final ReviewResultsService reviewResultsService;

    @GetMapping("/{reviewId}/results")
    public ResponseEntity<ReviewResultsResponse> getReviewResults(
            @PathVariable UUID reviewId
    ) {
        ReviewResultsResponse response =
                reviewResultsService.getResults(reviewId);

        return ResponseEntity.ok(response);
    }
}
