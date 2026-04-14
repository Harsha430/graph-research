from langgraph.graph import StateGraph, END
from langgraph.constants import Send
from .state import AgentState
from .nodes import planner_node, search_node, summarizer_node, critic_node, report_node


def route_after_critic(state: AgentState) -> str:
    """Retry if insufficient and under limit, else generate report."""
    if not state["is_sufficient"] and state["retry_count"] < 2:
        return "planner"       # loop back
    return "report_generator"


def parallel_search_router(state: AgentState) -> list[Send]:
    """Fan out — one search node per sub-question, runs in parallel."""
    return [
        Send("searcher", {**state, "_question": q})
        for q in state["sub_questions"]
    ]


def build_graph() -> StateGraph:
    g = StateGraph(AgentState)

    g.add_node("planner",        planner_node)
    g.add_node("searcher",       lambda s: search_node(s, s["_question"]))
    g.add_node("summarizer",     summarizer_node)
    g.add_node("critic",         critic_node)
    g.add_node("report_generator", report_node)

    g.set_entry_point("planner")

    # planner → parallel search (fan-out via Send)
    g.add_conditional_edges("planner", parallel_search_router, ["searcher"])

    # all searchers → summarizer (fan-in, state merges via operator.add)
    g.add_edge("searcher",   "summarizer")
    g.add_edge("summarizer", "critic")

    # critic → retry loop OR report
    g.add_conditional_edges(
        "critic",
        route_after_critic,
        {"planner": "planner", "report_generator": "report_generator"}
    )

    g.add_edge("report_generator", END)
    return g.compile()


research_agent = build_graph()
