from langgraph.graph import StateGraph
from app.graph.state import AgentState

from app.graph.nodes.memory_node import memory_node
from app.graph.nodes.extract_node import extract_node
from app.graph.nodes.dedup_node import dedup_application_node
from app.graph.nodes.company_node import company_node
from app.graph.nodes.create_app_node import create_app_node
from app.graph.nodes.update_app_node import update_app_node
from app.graph.nodes.gate_node import gate_node


def router(state):

    if state.get("error"):
        return "END"

    extraction = state.get("extraction")

    if not extraction:
        return "END"

    return extraction.get("action", "END")

builder = StateGraph(AgentState)
builder.add_node("gate", gate_node)
builder.add_node("memory", memory_node)
builder.add_node("extract", extract_node)
builder.add_node("dedup", dedup_application_node)
builder.add_node("company", company_node)
builder.add_node("create", create_app_node)
builder.add_node("update", update_app_node)

builder.set_entry_point("memory")

builder.add_edge("memory", "extract")
builder.add_edge("extract", "dedup")
builder.add_edge("dedup", "company")

builder.add_conditional_edges(
    "company",
    router,
    {
        "CREATE_JOB_APPLICATION": "create",
        "UPDATE_STATUS": "update",
        "END": "__end__"
    }
)

builder.set_finish_point("create")
builder.set_finish_point("update")

graph = builder.compile()