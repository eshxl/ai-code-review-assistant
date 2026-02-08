# 🤖 AI-Powered Code Review Assistant

An intelligent, multi-service platform for automated code reviews — powered by static analysis tools and AI-generated insights.

---

## 🧩 Tech Stack
- **Frontend:** Angular + Monaco Editor  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL + JSONB (+ pgvector-ready)  
- **AI Service:** FastAPI + LangChain  
- **Static Analysis Workers:** Pylint / ESLint / PMD  
- **Auth:** GitHub OAuth  
- **Deployment:** Docker + Render / AWS / GCP  

---

## 📂 Monorepo Structure
frontend/ → Angular + Monaco Editor   
backend/ → Spring Boot backend   
ai-service/ → FastAPI AI microservice  
static-analysis-worker/ → Python linter worker  
database/ → SQL schema, migrations, seeds  
infra/ → Docker + CI/CD setup  
docs/ → Project documentation  

# AI-Powered Code Review Assistant (Backend)

This repository contains the backend core for an AI-powered code review system.

## Features (Current)
- Asynchronous review jobs
- Static analysis via Python workers
- Red-Team secret scanning (blocks unsafe code)
- Persistent findings and job lifecycle tracking

## Tech Stack
- Java 20
- Spring Boot 3
- PostgreSQL
- FastAPI (Python workers)
- Pylint

## Status
Phase 1 complete.
Phase 2 (AI reasoning + patch generation) in progress.

## Security
- Code is never executed
- Secrets are detected and blocked before analysis
- No secrets are stored in plaintext
