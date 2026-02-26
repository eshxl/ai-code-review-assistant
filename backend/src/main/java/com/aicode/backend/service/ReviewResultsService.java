package com.aicode.backend.service;

import com.aicode.backend.dto.results.*;
import com.aicode.backend.model.Finding;
import com.aicode.backend.model.Job;
import com.aicode.backend.model.JobStatus;
import com.aicode.backend.model.SecurityFinding;
import com.aicode.backend.repository.FindingRepository;
import com.aicode.backend.repository.SecurityFindingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewResultsService {

    private final JobService jobService;
    private final FindingRepository findingRepository;
    private final SecurityFindingRepository securityFindingRepository;

    public ReviewResultsResponse getResults(UUID reviewId) {

        // 1. Fetch job
        Job job = jobService.getJob(reviewId);
        boolean blocked = job.getStatus() == JobStatus.BLOCKED;

        // 2. Fetch findings
        List<Finding> findings = findingRepository.findByReviewId(reviewId);

        // 3. Group findings by severity
        Map<String, List<FindingResultDTO>> groupedFindings =
                findings.stream()
                        .map(this::toFindingResult)
                        .collect(Collectors.groupingBy(
                                f -> f.severity().toLowerCase()
                        ));

        // Ensure all severity buckets exist (frontend safety)
        groupedFindings.putIfAbsent("critical", List.of());
        groupedFindings.putIfAbsent("high", List.of());
        groupedFindings.putIfAbsent("medium", List.of());
        groupedFindings.putIfAbsent("low", List.of());

        // 4. Build summary
        ReviewSummary summary = new ReviewSummary(
                groupedFindings.get("critical").size(),
                groupedFindings.get("high").size(),
                groupedFindings.get("medium").size(),
                groupedFindings.get("low").size()
        );

        // 5. Fetch security alerts
        List<SecurityAlertDTO> securityAlerts =
                securityFindingRepository.findByReviewId(reviewId)
                        .stream()
                        .map(this::toSecurityAlert)
                        .toList();

        // 6. Assemble response
        return new ReviewResultsResponse(
                reviewId,
                job.getStatus().name(),
                blocked,
                summary,
                groupedFindings,
                securityAlerts
        );
    }

    // ------------------ helpers ------------------

    private FindingResultDTO toFindingResult(Finding finding) {
        return new FindingResultDTO(
                finding.getFindingId(),
                finding.getSeverity(),
                finding.getToolName(),
                finding.getMessage(),
                new AiResultDTO(
                        finding.getAiExplanation(),
                        finding.getAiPatch(),
                        Optional.ofNullable(finding.getAiConfidence()).orElse(0.0),
                        finding.getOriginalCode(),
                        finding.getFixedCode()
                )
        );
    }

    private SecurityAlertDTO toSecurityAlert(SecurityFinding sf) {
        return new SecurityAlertDTO(
                sf.getType(),
                sf.getFilePath()
        );
    }
}