from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import AIEngine

router = APIRouter(prefix="/review", tags=["AI Review"])

ai_engine = AIEngine()

class CodeReviewRequest(BaseModel):
    code_snippet: str
    language: str

@router.post("/analyze")
def analyze_code(request: CodeReviewRequest):
    try:
        feedback = ai_engine.analyze_code(request.code_snippet, request.language)
        # feedback is a dict: {"summary", "raw", "model", "meta"}
        return {"feedback": feedback}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
