package com.aicode.backend.repository;

import com.aicode.backend.model.SecurityFinding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SecurityFindingRepository extends JpaRepository<SecurityFinding, UUID> {
}