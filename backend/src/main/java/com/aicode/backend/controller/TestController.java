package com.aicode.backend.controller;

import com.aicode.backend.model.CodeReviewSession;
import com.aicode.backend.repository.CodeReviewSessionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final CodeReviewSessionRepository repository;

    public TestController(CodeReviewSessionRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/add")
    public CodeReviewSession addSession(@RequestBody CodeReviewSession session) {
        return repository.save(session);
    }

    @GetMapping("/all")
    public List<CodeReviewSession> getAllSessions() {
        return repository.findAll();
    }
}