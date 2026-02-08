package com.aicode.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "findings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Finding {

    @Id
    @GeneratedValue
    private UUID findingId;

    private UUID reviewId;
    private String toolName;
    private String severity;
    private String message;

    @Column(columnDefinition = "TEXT")
    private String staticDetail; // raw JSON from tool

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
