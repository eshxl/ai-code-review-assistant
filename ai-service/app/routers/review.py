from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import run_ai_review

router = APIRouter()

class AiReviewRequest(BaseModel):
    language: str
    code: str
    findings: list[dict]

@router.post("/review/ai")
def ai_review(request: AiReviewRequest):
    try:
        return run_ai_review(
            request.language,
            request.code,
            request.findings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))