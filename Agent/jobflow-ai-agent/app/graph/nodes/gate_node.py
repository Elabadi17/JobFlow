def gate_node(state):
    error = state.get("error")

    if error:
        print("⛔ FLOW STOPPED:", error)
        return None  # STOP LANGGRAPH EXECUTION

    return state