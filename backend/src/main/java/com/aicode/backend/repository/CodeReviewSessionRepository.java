package com.aicode.backend.repository;

import com.aicode.backend.model.CodeReviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeReviewSessionRepository extends JpaRepository<CodeReviewSession, Long> {
}