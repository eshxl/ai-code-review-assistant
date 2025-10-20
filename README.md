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