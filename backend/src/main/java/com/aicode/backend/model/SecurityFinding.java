package com.aicode.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "security_findings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityFinding {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID reviewId;
    private String type; // e.g. AWS_ACCESS_KEY, PASSWORD
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String filePath;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}