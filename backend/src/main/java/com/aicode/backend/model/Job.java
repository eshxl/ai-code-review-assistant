package com.aicode.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue
    private UUID jobId;

    @Column(nullable = false)
    private String type; 
    // e.g. "REVIEW", "STATIC_ANALYSIS", "AI_ANALYSIS"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;
    // QUEUED, RUNNING, COMPLETED, FAILED, BLOCKED

    @Column(columnDefinition = "TEXT")
    private String payload; 
    // JSON string describing what this job is about

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}