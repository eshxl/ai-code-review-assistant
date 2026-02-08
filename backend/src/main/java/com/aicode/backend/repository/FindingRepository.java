package com.aicode.backend.repository;

import com.aicode.backend.model.Finding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FindingRepository extends JpaRepository<Finding, UUID> {
}
