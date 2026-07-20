import json
from app.services.llm_service import LLMService
from app.prompts.extraction_prompt import PROMPT
from app.utils.logger import log

llm = LLMService()

def extract_node(state):
    #log("extract_node", state)

    email = state.get("email")

    if not email:
        return {**state, "error": "missing_email"}

    result = llm.invoke(PROMPT.format(email=email)).strip()

    if result.startswith("```"):
        result = result.removeprefix("```json")
        result = result.removeprefix("```")
        result = result.removesuffix("```").strip()

    try:
        extraction = json.loads(result)
    except Exception:
        return {
            **state,
            "error": "invalid_json",
            "raw": result
        }

    extraction["action"] = extraction.get("action", "").upper()

    if extraction.get("status"):
        extraction["status"] = extraction["status"].upper()

    return {
        **state,
        "extraction": extraction
    }