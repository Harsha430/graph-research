import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent.graph import research_agent
import json
import asyncio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/research/stream")
async def stream_research(topic: str):
    async def event_generator():
        initial_state = {
            "topic": topic,
            "retry_count": 0,
            "search_results": [],
            "summaries": [],
            "sub_questions": []
        }
        
        # Mapping for logs to be more descriptive
        node_logs = {
            "planner": "Initializing research plan and decomposing queries...",
            "searcher": "Executing deep web search across parallel workers...",
            "summarizer": "Synthesizing and analyzing retrieved data points...",
            "critic": "Conducting autonomous quality verification...",
            "report_generator": "Composing final professional-grade report..."
        }

        # Usage tracking
        total_usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

        try:
            # First log entry
            yield f"data: {json.dumps({'type': 'log', 'data': {'message': 'System handshaking complete. Starting research...', 'type': 'info'}})}\n\n"
            await asyncio.sleep(0.5)

            last_node = None
            
            for event in research_agent.stream(initial_state):
                if not event: continue
                
                node_name = list(event.keys())[0]
                state_update = event[node_name]
                
                # Signal node start if it changed
                if node_name != last_node:
                    if last_node:
                        yield f"data: {json.dumps({'type': 'step_complete', 'node': last_node})}\n\n"
                        await asyncio.sleep(0.3)

                    yield f"data: {json.dumps({'type': 'step_start', 'node': node_name})}\n\n"
                    msg = node_logs.get(node_name, f"Entering node: {node_name}")
                    yield f"data: {json.dumps({'type': 'log', 'data': {'message': msg, 'type': 'info'}})}\n\n"
                    last_node = node_name
                    await asyncio.sleep(0.5)

                # Process usage metrics if present
                if "usage" in state_update:
                    u = state_update["usage"]
                    for k in total_usage:
                        total_usage[k] += u.get(k, 0)
                    yield f"data: {json.dumps({'type': 'usage', 'data': total_usage})}\n\n"

                # Special data updates
                if node_name == "planner" and "sub_questions" in state_update:
                    yield f"data: {json.dumps({'type': 'questions', 'data': state_update['sub_questions']})}\n\n"
                    await asyncio.sleep(0.3)

                if "final_report" in state_update:
                    report = state_update["final_report"]
                    yield f"data: {json.dumps({'type': 'log', 'data': {'message': 'Streaming final synthesized report...', 'type': 'info'}})}\n\n"
                    
                    chunks = [report[i:i+50] for i in range(0, len(report), 50)]
                    for chunk in chunks:
                        yield f"data: {json.dumps({'type': 'report_chunk', 'data': chunk})}\n\n"
                        await asyncio.sleep(0.05)

                await asyncio.sleep(0.3)
                
            if last_node:
                yield f"data: {json.dumps({'type': 'step_complete', 'node': last_node})}\n\n"
                await asyncio.sleep(0.3)

            yield f"data: {json.dumps({'type': 'log', 'data': {'message': 'Research complete. Report ready.', 'type': 'success'}})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'node': 'report_generator'})}\n\n"
            await asyncio.sleep(0.5)
                
        except Exception as e:
            yield f"data: {json.dumps({'type': 'log', 'data': {'message': f'System Error: {str(e)}', 'type': 'error'}})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
