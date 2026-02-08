package com.aicode.backend.service;
import com.aicode.backend.model.JobStatus;
import com.aicode.backend.dto.JobStatusResponse;
import com.aicode.backend.model.Job;
import com.aicode.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(String type, String payload) {
        Job job = new Job();
        job.setType(type);
        job.setStatus(JobStatus.QUEUED);
        job.setPayload(payload);
        return jobRepository.save(job);
    }

    public Job getJob(UUID jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void updateStatus(UUID jobId, JobStatus status) {
        Job job = getJob(jobId);
        job.setStatus(status); 
        jobRepository.save(job);
    }

    public void failJob(UUID jobId, String error) {
        Job job = getJob(jobId);
        job.setStatus(JobStatus.FAILED);
        job.setErrorMessage(error);
        jobRepository.save(job);
    }
    public JobStatusResponse getJobStatus(UUID jobId) {
        Job job = getJob(jobId);

        return new JobStatusResponse(
                job.getJobId(),
                job.getType(),
                job.getStatus(),
                job.getErrorMessage(),
                job.getUpdatedAt()
        );
    }
}