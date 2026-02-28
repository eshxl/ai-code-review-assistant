# AI-Powered Code Review Assistant

![Angular](https://img.shields.io/badge/Frontend-Angular_17-red)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-green)
![Python](https://img.shields.io/badge/AI_Service-Python_FastAPI-yellow)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

A full-stack AI-driven code review platform that combines static analysis, security scanning, and large language model reasoning to generate structured explanations and verifiable code fixes with side-by-side diff visualization.

---

## Overview

This project is a microservice-based AI code review system designed to:

- Perform static code analysis
- Detect hardcoded secrets (Red-Team mode)
- Generate AI-powered explanations and patches
- Render Git-style diffs using Monaco Editor
- Process jobs asynchronously
- Persist results in PostgreSQL

The system is designed with production-oriented architecture principles and modular extensibility.

---

## Screenshots

### 1. Workspace Projects Dashboard
*Glassmorphism UI displaying recent analysis jobs.*
![Dashboard](screenshots/dashboard.png)

### 2. Monaco Diff Viewer
*Red/Green diff rendering with AI-generated fixes.*
![Diff Viewer](screenshots/diff-viewer.png)

### 3. Red-Team Security Interception
*The pipeline halts and prevents data leakage when sensitive secrets are detected.*
![Security Block](screenshots/security-block.png)

---

## Architecture

```
Angular Frontend
       │
       ▼
Spring Boot Backend (REST API)
       │
       ├── Static Analysis Service (Python / FastAPI)
       ├── AI Service (Ollama LLM)
       └── PostgreSQL Database
```

---

## Core Features

### Static Analysis
Integrates Python-based analysis (e.g., Pylint-style findings). Persists structured findings mapped directly to the code.

### Secret Scanning (Red-Team Mode)
Detects hardcoded API keys, AWS keys, and database URLs. Blocks the review pipeline if secrets are found to prevent leakage. Stores security alerts separately for auditing.

### AI-Powered Code Reasoning
Uses a local LLM via Ollama (`llama3:instruct`). Generates a detailed explanation, confidence score, original code snippet, fixed code snippet, and unified diff patch.

### Structured Patch Generation
AI returns strictly structured JSON containing `originalCode`, `fixedCode`, `patch`, and `confidence`, enabling precise, side-by-side diff visualization on the client.

### Monaco Diff Viewer
GitHub-style red/green side-by-side comparison. Includes copy patch and download patch (`.diff`) functionalities. Collapsible AI explanations for a clean reading experience.

### Asynchronous Job Execution
Background job processing using Java Executors. Status tracking: `QUEUED`, `RUNNING`, `BLOCKED`, `COMPLETED`, `FAILED`. RxJS polling-based progress tracking on the frontend.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Java 17, Spring Boot, Spring WebFlux (WebClient), Spring Data JPA, PostgreSQL, Lombok |
| AI & Analysis | Python, FastAPI, Ollama (llama3:instruct) |
| Frontend | Angular 17 (Standalone Architecture), Monaco Editor (ngx-monaco-editor-v2), TypeScript, Tailwind CSS |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Submit new code for analysis |
| GET | `/api/jobs/{jobId}` | Poll the current status of the pipeline |
| GET | `/api/reviews/{reviewId}/results` | Fetch aggregated static & AI findings |
| GET | `/api/reviews` | List all historical reviews |

---

## Database Entities

- **Job** — Tracks the async execution state and timestamps.
- **Finding** — Stores static analysis rules, line numbers, and the AI payload (explanation, confidence, original code, fixed code, patch).
- **SecurityFinding** — Stores blocked secrets intercepted by the Red-Team scanner.

---

## Running the Project

### 1. Database Setup

Ensure PostgreSQL is running and create the database:

```sql
CREATE DATABASE code_review_db;
```

### 2. Start Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Runs on: `http://localhost:8081`

### 3. Start Analysis & AI Service (Python)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs on: `http://localhost:8000`

### 4. Start Local LLM (Ollama)

```bash
ollama run llama3:instruct
```

### 5. Start Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

Runs on: `http://localhost:4200`

---

## Future Improvements

- [ ] JWT Authentication & user ownership
- [ ] Dockerized microservice deployment (docker-compose)
- [ ] GitHub OAuth integration
- [ ] WebSocket real-time updates (replacing HTTP polling)
- [ ] Multi-language support (JavaScript, Java, Go)
- [ ] CI/CD Pipeline integration

---

## Project Goals

This system demonstrates microservice communication, AI-driven code remediation, secure code processing pipelines, structured LLM output parsing, full-stack integration, and production-oriented architecture.

---

## Author

**Eshal Shanoj** — Software Engineering Student

---

## License

MIT License

---
