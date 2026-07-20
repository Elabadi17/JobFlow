from app.graph.memory.redis_memory import RedisMemory

memory = RedisMemory()

def dedup_application_node(state):
    extraction = state.get("extraction")

    if not extraction:
        return {**state, "error": "missing_extraction"}

    company = extraction.get("company")
    position = extraction.get("position")
    action = extraction.get("action")

    if not company or not position:
        return {**state, "error": "invalid_extraction"}

    # 🔥 Only dedup CREATE actions — updates are expected to match existing apps
    if action == "CREATE_JOB_APPLICATION":
        if memory.is_application_seen(company, position):
            return {**state, "error": "duplicate_application"}
        memory.mark_application(company, position)

    return state