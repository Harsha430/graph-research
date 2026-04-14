from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

class SearchTool:
    def __init__(self):
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY not found in environment")
        self.client = TavilyClient(api_key=api_key)

    def search(self, query: str, max_results: int = 4, search_depth: str = "advanced"):
        return self.client.search(
            query=query,
            max_results=max_results,
            search_depth=search_depth
        )

search_tool = SearchTool()
