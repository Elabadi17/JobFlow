from app.graph.memory.redis_memory import RedisMemory
from app.utils.logger import log

memory = RedisMemory()

def memory_node(state):
    #log("memory_node", state)

    email = state.get("email")

    if not email:
        return {**state, "error": "missing_email"}

    if memory.is_email_seen(email):
        return {**state, "error": "duplicate_email"}

    memory.mark_email(email)

    return state