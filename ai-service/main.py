from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.services.ai_engine import AIEngine
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="AI Code Review Service", version="2.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AIEngine()

class CodeReviewRequest(BaseModel):
    code_snippet: str
    language: str = "python"
    model: Optional[str] = None  # Allow model selection

@app.get("/")
def read_root():
    return {
        "service": "AI Code Review Service",
        "status": "running",
        "available_models": engine.get_available_models()
    }

@app.get("/models")
def get_models():
    """Get list of available models"""
    return {
        "available": engine.get_available_models(),
        "installed": engine.check_model_availability()
    }

@app.post("/review/analyze")
async def analyze_code(request: Request):
    """
    Analyze code with optional model selection
    
    Payload:
    {
        "code_snippet": "def hello(): ...",
        "language": "python",
        "model": "mistral:7b"  # Optional
    }
    """
    data = await request.json()
    code = data.get("code_snippet", "")
    lang = data.get("language", "python")
    model = data.get("model", None)  # Get model from request
    
    if not code:
        return {"error": "No code_snippet provided"}
    
    # Pass model to AI engine
    result = engine.analyze_code(code, lang, model)
    
    print(f"📤 Returning to backend: {list(result.keys())}")
    return result

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-code-review"}