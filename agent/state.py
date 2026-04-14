from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    topic: str                                        # original input
    sub_questions: list[str]                          # planner output
    search_results: Annotated[list[dict], operator.add]  # parallel merge
    summaries: list[str]                              # per-question summaries
    critique: str                                     # critic feedback
    retry_count: int                                  # max 2 retries
    final_report: str                                 # markdown output
    is_sufficient: bool                               # critic decision
    usage: dict                                       # token and cost tracking
