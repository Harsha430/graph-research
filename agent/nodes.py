from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from tavily import TavilyClient
from .state import AgentState
from .prompts import PLANNER_PROMPT, SUMMARIZER_PROMPT, CRITIC_PROMPT, REPORT_PROMPT
import os, json
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import time

load_dotenv()

# Dual Model Strategy
# 8B for fast, cheap intermediate steps
llm_fast = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
# 70B for high-quality final report and critique
llm_smart = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def get_usage_metrics(response):
    """Extract token usage from Groq response metadata."""
    metadata = response.response_metadata
    token_usage = metadata.get("token_usage", {})
    return {
        "prompt_tokens": token_usage.get("prompt_tokens", 0),
        "completion_tokens": token_usage.get("completion_tokens", 0),
        "total_tokens": token_usage.get("total_tokens", 0)
    }

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type(Exception) # In production we would filter specifically for 429
)
def invoke_with_retry(llm, messages):
    return llm.invoke(messages)

# ── 1. PLANNER ──────────────────────────────────────────────
def planner_node(state: AgentState) -> dict:
    prompt = PLANNER_PROMPT.format(topic=state["topic"])
    response = invoke_with_retry(llm_fast, [HumanMessage(content=prompt)])
    usage = get_usage_metrics(response)

    # parse numbered list from LLM output
    lines = response.content.strip().split("\n")
    questions = []
    for l in lines:
        l = l.strip()
        if not l: continue
        if l[0].isdigit():
            parts = l.split(".", 1) if "." in l else l.split(")", 1)
            if len(parts) > 1:
                questions.append(parts[1].strip())
            else:
                questions.append(l.strip())
    
    return {
        "sub_questions": questions[:5],
        "retry_count": state.get("retry_count", 0),
        "search_results": [],
        "usage": usage
    }

# ── 2. SEARCHER ─────────────────────────────────────────────
def search_node(state: AgentState, question: str) -> dict:
    results = tavily.search(
        query=question,
        max_results=5, # Reduced from 10 to be more efficient
        search_depth="advanced"
    )
    return {
        "search_results": [{
            "question": question,
            "results": results["results"]
        }]
    }

# ── 3. SUMMARIZER ───────────────────────────────────────────
def summarizer_node(state: AgentState) -> dict:
    summaries = []
    total_usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    
    for item in state["search_results"]:
        content = "\n".join(
            f"- {r['title']}: {r['content'][:300]}"
            for r in item["results"]
        )
        prompt = SUMMARIZER_PROMPT.format(
            question=item["question"],
            content=content
        )
        resp = invoke_with_retry(llm_fast, [HumanMessage(content=prompt)])
        usage = get_usage_metrics(resp)
        
        for k in total_usage:
            total_usage[k] += usage[k]
            
        summaries.append(f"### {item['question']}\n{resp.content}")

    return {"summaries": summaries, "usage": total_usage}

# ── 4. CRITIC ───────────────────────────────────────────────
def critic_node(state: AgentState) -> dict:
    combined = "\n\n".join(state["summaries"])
    prompt = CRITIC_PROMPT.format(
        topic=state["topic"],
        summaries=combined,
        retry_count=state.get("retry_count", 0)
    )
    resp = invoke_with_retry(llm_smart, [HumanMessage(content=prompt)])
    usage = get_usage_metrics(resp)
    text = resp.content.strip()

    is_sufficient = "SUFFICIENT" in text.upper()
    critique = text.replace("SUFFICIENT", "").replace("INSUFFICIENT", "").strip()

    return {
        "critique": critique,
        "is_sufficient": is_sufficient,
        "retry_count": state.get("retry_count", 0) + (0 if is_sufficient else 1),
        "usage": usage
    }

# ── 5. REPORT GENERATOR ─────────────────────────────────────
def report_node(state: AgentState) -> dict:
    combined = "\n\n".join(state["summaries"])
    prompt = REPORT_PROMPT.format(
        topic=state["topic"],
        summaries=combined
    )
    resp = invoke_with_retry(llm_smart, [HumanMessage(content=prompt)])
    usage = get_usage_metrics(resp)
    return {"final_report": resp.content, "usage": usage}
