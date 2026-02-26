import json
import subprocess
import re

OLLAMA_MODEL = "llama3:instruct"


def extract_json(text: str) -> dict:
    """
    Extracts the first JSON object found in LLM output.
    """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in LLM output")

    return json.loads(match.group())


def run_ai_review(language: str, code: str, findings: list[dict]) -> dict:
    """
    Runs Ollama locally and returns structured AI review output.
    """

    prompt = f"""
Respond with STRICT JSON only. No extra explanations. No markdown. No backticks.

You are a senior software engineer performing a code review.

Return EXACTLY this JSON format:

{{
  "explanation": "...",
  "confidence": 0.85,
  "original_code": "...",
  "fixed_code": "...",
  "patch": "optional unified diff string"
}}

EXPLANATION REQUIREMENTS:
- Explain the root cause of the issue.
- Explain why it is problematic (security, performance, maintainability, etc.).
- Explain potential real-world consequences.
- Explain why the suggested fix resolves the issue.
- Use clear, professional language.
- Minimum 3–5 sentences unless the issue is trivial.

RULES:
- Use ONLY the provided code and findings.
- Do NOT invent new issues.
- original_code must be the exact snippet being corrected.
- fixed_code must contain the full corrected version of that snippet.
- patch must be a valid unified diff (or empty string).
- confidence must be between 0 and 1.
- Output STRICT JSON only.

INPUT:
Language: {language}

Code:
{code}

Static Analysis Findings:
{json.dumps(findings, indent=2)}
"""

    result = subprocess.run(
        [
            "ollama",
            "run",
            OLLAMA_MODEL,
            "--format",
            "json",
            prompt
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    parsed = extract_json(result.stdout)

    return {
        "explanation": parsed.get("explanation"),
        "confidence": parsed.get("confidence"),
        "originalCode": parsed.get("original_code"),
        "fixedCode": parsed.get("fixed_code"),
        "patch": parsed.get("patch", "")
    }