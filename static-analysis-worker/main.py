from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import tempfile
import os
import json
import traceback
import sys

app = FastAPI(title="Static Analysis Worker")

class AnalysisRequest(BaseModel):
    code: str
    language: str

@app.post("/analyze")
def analyze_code(req: AnalysisRequest):
    try:
        if req.language != "python":
            return {"findings": [], "message": "Language not supported yet"}

        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
            f.write(req.code.encode("utf-8"))
            temp_file = f.name

        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "pylint",
                temp_file,
                "--output-format=json"
            ],
            capture_output=True,
            text=True
        )

        findings = json.loads(result.stdout) if result.stdout else []

        return {
            "tool": "pylint",
            "findings": findings
        }

    except Exception as e:
        print("STATIC ANALYSIS ERROR")
        traceback.print_exc()
        return {
            "error": str(e)
        }

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)