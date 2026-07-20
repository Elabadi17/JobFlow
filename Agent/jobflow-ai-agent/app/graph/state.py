from typing import TypedDict, Optional, Any

class AgentState(TypedDict, total=False):
    email: str
    extraction: Optional[dict]
    result: Optional[dict]
    error: Optional[str]
    company: Optional[dict]      # <-- add this
    company_id: Optional[str]    # <-- add this