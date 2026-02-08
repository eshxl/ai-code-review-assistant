import json
import subprocess
import sys
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
Respond with JSON only. No explanations. No markdown. No backticks.

You are a senior software engineer performing a code review.

RULES:
- Use ONLY the provided code and findings
- Do NOT invent new issues
- Output STRICT JSON only
- Patch must be a valid unified diff
- If no patch is possible, return an empty string for patch

INPUT:
Language: {language}

Code:
{code}

Static Analysis Findings:
{json.dumps(findings, indent=2)}

OUTPUT JSON FORMAT:
{{
  "explanation": "<clear explanation>",
  "patch": "<unified diff or empty string>",
  "confidence": <number between 0 and 1>
}}
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

    return extract_json(result.stdout)
