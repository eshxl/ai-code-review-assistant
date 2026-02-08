package com.aicode.backend.repository;

import com.aicode.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID> {
}