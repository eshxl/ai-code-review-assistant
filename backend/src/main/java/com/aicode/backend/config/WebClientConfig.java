package com.aicode.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient staticAnalysisWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:9001")
                .build();
    }

    @Bean
    public WebClient aiWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:9002")
                .build();
    }
}