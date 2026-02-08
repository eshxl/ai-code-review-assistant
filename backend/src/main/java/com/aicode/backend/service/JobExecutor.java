package com.aicode.backend.service;

import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.aicode.backend.model.Finding;
import com.aicode.backend.model.Job;
import com.aicode.backend.model.JobStatus;
import com.aicode.backend.model.SecurityFinding;
import com.aicode.backend.repository.FindingRepository;
import com.aicode.backend.repository.SecurityFindingRepository;
import com.aicode.backend.security.SecretScanner;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.aicode.backend.model.JobStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobExecutor {

    private final JobService jobService;
    private final WebClient staticAnalysisWebClient;
    private final FindingRepository findingRepository;
    private final SecretScanner secretScanner;
    private final SecurityFindingRepository securityFindingRepository;

    @Async
    public void executeReviewJob(UUID jobId) {
        try {
            log.info("Starting job {}", jobId);

            // Step 1: mark as RUNNING
            jobService.updateStatus(jobId, JobStatus.RUNNING);

            // Simulate static analysis
            Job job = jobService.getJob(jobId);
            String code = job.getPayload();

            // Red-Team / Secret Scan
            List<String> secrets = secretScanner.scan(code);

            if (!secrets.isEmpty()) {
                for (String type : secrets) {
                    SecurityFinding sf = new SecurityFinding();
                    sf.setReviewId(jobId);
                    sf.setType(type);
                    securityFindingRepository.save(sf);
                }

                jobService.updateStatus(jobId, JobStatus.BLOCKED);
                log.warn("Job {} blocked due to secret detection: {}", jobId, secrets);
                return; // STOP further processing
            }

            String response = staticAnalysisWebClient.post()
                .uri("/analyze")
                .bodyValue(Map.of(
                        "code", code,
                        "language", "python"
                ))
                .retrieve()
                .bodyToMono(String.class)
                .block();

            // Parse JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode findings = root.get("findings");

            if (findings != null && findings.isArray()) {
                for (JsonNode f : findings) {
                    Finding finding = new Finding();
                    finding.setReviewId(jobId); // temporary mapping
                    finding.setToolName("pylint");
                    finding.setSeverity(f.get("type").asText());
                    finding.setMessage(f.get("message").asText());
                    finding.setStaticDetail(f.toString());

                    findingRepository.save(finding);
                }
            }
            
            // Simulate AI processing
            Thread.sleep(3000);

            // Step 2: mark as COMPLETED
            jobService.updateStatus(jobId, JobStatus.COMPLETED);
            log.info("Completed job {}", jobId);

        } catch (Exception e) {
            log.error("Job {} failed", jobId, e);
            jobService.failJob(jobId, e.getMessage());
        }
    }
}