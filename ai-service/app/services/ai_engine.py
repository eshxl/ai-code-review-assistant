import os
import requests
import time
import json
from typing import Dict, Any

# ---- Ollama Config ----
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://127.0.0.1:11434/api/generate")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT_SEC", "120"))

# Available models for testing
AVAILABLE_MODELS = [
    "codellama:7b-instruct",
    "mistral:7b",
    "llama3:instruct",
    "phi3:mini"  # Ollama's version of phi
]

class AIEngine:
    def analyze_code(self, code_snippet: str, language: str, model_name: str = None) -> Dict[str, Any]:
        """
        Sends code to Ollama and returns structured feedback.
        Now supports multiple models for comparison!
        
        Args:
            code_snippet: The code to review
            language: Programming language
            model_name: Optional model override (defaults to codellama)
        """
        
        # Use provided model or default
        selected_model = model_name or "codellama:7b-instruct"
        
        print(f"\n{'='*60}")
        print(f"🤖 Using Model: {selected_model}")
        print(f"📝 Language: {language}")
        print(f"{'='*60}")

        prompt = f"""You are an expert software code reviewer with 10+ years of experience.
Review the following {language} code carefully.

Return your feedback STRICTLY in valid JSON format with these keys:
- summary: 3-4 sentences summarizing the logic and purpose.
- score: a number between 0 and 10.
- recommendations: a list of improvement suggestions.
- strengths: a few positives.

DO NOT include markdown, explanations, or pre/post text.
Only output valid JSON.

Code to review:
{code_snippet}

Your JSON response:"""

        payload = {
            "model": selected_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 500
            }
        }

        try:
            print(f"🚀 Sending request to Ollama at: {OLLAMA_API_URL}")
            start_time = time.time()
            
            response = requests.post(OLLAMA_API_URL, json=payload, timeout=OLLAMA_TIMEOUT)
            
            duration = round(time.time() - start_time, 2)
            print(f"✅ HTTP Status: {response.status_code} | ⏱️ Response Time: {duration}s")

            response.raise_for_status()

            # Parse Ollama response
            try:
                data = response.json()
                raw = data.get("response", "").strip()
                
                # Track tokens if available (some models provide this)
                eval_count = data.get("eval_count", 0)
                prompt_eval_count = data.get("prompt_eval_count", 0)
                
            except Exception as e:
                print(f"⚠️ Failed to parse Ollama response: {e}")
                raw = response.text.strip()
                eval_count = 0
                prompt_eval_count = 0

            if not raw:
                return self._create_error_response("Empty response from Ollama", duration, selected_model)

            # Try to extract JSON from the response
            structured = self._extract_json(raw)
            
            parsing_success = structured is not None
            
            if not structured:
                print("⚠️ Could not parse JSON. Using raw text as summary.")
                structured = {
                    "summary": raw[:500] + ("..." if len(raw) > 500 else ""),
                    "score": None,
                    "recommendations": ["Unable to generate structured recommendations"],
                    "strengths": []
                }

            # Ensure all required fields exist
            feedback = {
                "summary": structured.get("summary", "No summary available."),
                "score": structured.get("score"),
                "recommendations": structured.get("recommendations", []),
                "strengths": structured.get("strengths", []),
                "raw": raw,
                "model": selected_model,
                "meta": {
                    "status_code": response.status_code,
                    "duration_sec": duration,
                    "parsing_success": parsing_success,
                    "tokens_generated": eval_count,
                    "tokens_prompt": prompt_eval_count,
                    "total_tokens": eval_count + prompt_eval_count,
                    "tokens_per_second": round(eval_count / duration, 2) if duration > 0 and eval_count > 0 else 0
                }
            }

            print(f"✅ Score: {feedback['score']} | Parsing: {'✓' if parsing_success else '✗'}")
            print(f"📊 Tokens: {eval_count} generated, {prompt_eval_count} prompt")
            print(f"⚡ Speed: {feedback['meta']['tokens_per_second']} tokens/sec")
            print(f"{'='*60}\n")
            
            return {"feedback": feedback}

        except requests.exceptions.ConnectionError:
            print("❌ Connection error: Ollama not reachable")
            return self._create_error_response("Ollama not reachable", None, selected_model)

        except requests.exceptions.Timeout:
            print("❌ Timeout error: Ollama took too long to respond")
            return self._create_error_response("Ollama timeout", None, selected_model)

        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return self._create_error_response(str(e), None, selected_model)

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from text, handling various formats"""
        # Try direct JSON parse
        try:
            return json.loads(text)
        except:
            pass

        # Try to find JSON between curly braces
        start_idx = text.find("{")
        end_idx = text.rfind("}") + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_text = text[start_idx:end_idx]
            try:
                return json.loads(json_text)
            except:
                pass

        # Try to find JSON in code blocks
        if "```json" in text:
            try:
                json_start = text.index("```json") + 7
                json_end = text.index("```", json_start)
                json_text = text[json_start:json_end].strip()
                return json.loads(json_text)
            except:
                pass

        return None

    def _create_error_response(self, error_msg: str, duration: float, model: str) -> Dict[str, Any]:
        """Create a consistent error response"""
        return {
            "feedback": {
                "summary": "",
                "score": None,
                "recommendations": [],
                "strengths": [],
                "raw": "",
                "model": model,
                "meta": {
                    "error": error_msg,
                    "duration_sec": duration,
                    "parsing_success": False,
                    "tokens_generated": 0,
                    "tokens_prompt": 0,
                    "total_tokens": 0,
                    "tokens_per_second": 0
                }
            }
        }

    def get_available_models(self) -> list:
        """Return list of available models"""
        return AVAILABLE_MODELS
    
    def check_model_availability(self) -> Dict[str, bool]:
        """Check which models are actually installed in Ollama"""
        try:
            response = requests.get("http://127.0.0.1:11434/api/tags", timeout=5)
            if response.status_code == 200:
                installed = response.json().get("models", [])
                installed_names = [m.get("name", "") for m in installed]
                
                return {
                    model: any(model in name for name in installed_names)
                    for model in AVAILABLE_MODELS
                }
        except:
            pass
        
        # Return all as True if we can't check (assume they're available)
        return {model: True for model in AVAILABLE_MODELS}