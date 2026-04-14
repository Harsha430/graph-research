# 🧠 Research Agent (Backend)

The core intelligence of the system, powered by **LangGraph** and **Groq**. This agent uses a multi-step reasoning cycle to perform deep web research and synthesize high-quality reports.

## 🛠 Tech Stack
- **Framework**: [LangGraph](https://github.com/langchain-ai/langgraph) (Stateful multi-agent orchestration)
- **Model**: [ChatGroq](https://python.langchain.com/docs/integrations/chat/groq/) (Llama-3.3-70B-Versatile & Llama-3.1-8B-Instant)
- **Search**: [Tavily AI](https://tavily.com/) (Optimized for LLM research)
- **API**: [FastAPI](https://fastapi.tiangolo.com/)

## 🏗 Graph Nodes
| Node | Responsibility | Model |
| :--- | :--- | :--- |
| **Planner** | Decomposes the topic into 5 granular sub-questions | Llama-3.1-8B |
| **Searcher** | Executes parallel web searches via Tavily | N/A (Tools) |
| **Summarizer** | Synthesizes search results into coherent sections | Llama-3.1-8B |
| **Critic** | Evaluates the summary for depth and accuracy | Llama-3.3-70B |
| **Reporter** | Generates the final structured Markdown report | Llama-3.3-70B |

## 🚀 Getting Started
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure `.env`:
   ```env
   GROQ_API_KEY=your_key
   TAVILY_API_KEY=your_key
   ```
3. Run the server:
   ```bash
   python main.py
   ```
