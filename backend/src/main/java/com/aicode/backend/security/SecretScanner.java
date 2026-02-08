package com.aicode.backend.security;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;

@Component
public class SecretScanner {

    private final Map<String, Pattern> patterns = Map.of(
            "AWS_ACCESS_KEY", Pattern.compile("AKIA[0-9A-Z]{16}"),
            "GITHUB_TOKEN", Pattern.compile("ghp_[0-9a-zA-Z]{36}"),
            "GENERIC_API_KEY", Pattern.compile("(?i)api[_-]?key\\s*=\\s*['\"][^'\"]+['\"]"),
            "PASSWORD", Pattern.compile("(?i)password\\s*=\\s*['\"][^'\"]+['\"]"),
            "PRIVATE_KEY", Pattern.compile("-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----")
    );

    public List<String> scan(String code) {
        List<String> findings = new ArrayList<>();

        for (Map.Entry<String, Pattern> entry : patterns.entrySet()) {
            if (entry.getValue().matcher(code).find()) {
                findings.add(entry.getKey());
            }
        }

        return findings;
    }
}