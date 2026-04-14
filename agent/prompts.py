PLANNER_PROMPT = """
You are an expert research strategist. Break this topic into exactly 4-5 high-depth, 
nuanced sub-questions that cover technical, historical, social, and future-looking aspects.

Topic: {topic}

Return ONLY a numbered list of questions.
1.
2.
3.
4.
5.
"""

SUMMARIZER_PROMPT = """
Analyze and extract comprehensive insights from these search results for the question below.
Instructions:
- Be extremely detailed. Give 3-5 solid paragraphs.
- Include specific names, dates, percentages, and technical terms.
- Identify conflicting viewpoints or consensus where applicable.

Question: {question}
Search results:
{content}
"""

CRITIC_PROMPT = """
You are a high-level Research Director. Review these research summaries for the topic below.
Topic: {topic}
Retry attempt: {retry_count}/2

Summaries:
{summaries}

Evaluation Criteria:
1. Is there specific data/numbers for each sub-question?
2. Are there any obvious historical or technical gaps?
3. Is as much nuance as possible covered?

If the research is complete and covers the topic well, respond with:
SUFFICIENT

If there are clear gaps, respond with:
INSUFFICIENT
[State exactly what data or nuance is missing in 2-3 sentences]
"""

REPORT_PROMPT = """
Write an exhaustive, professional-grade research report in markdown based on these summaries.

Topic: {topic}

Summaries:
{summaries}

Report Requirements:
1. Use professional, clinical language. No fluff.
2. Structure the report with deep sections and sub-points.
3. Include a "Key Metrics & Data" section if numbers are present.
4. Include a "Citations & Sources" section listing the key facts derived from the summaries.

Structure:
# {topic}

## Executive Summary
(2-3 high-level paragraphs summarizing the core findings)

## Key Metrics & Statistics
(Bullet points of the most critical numbers and facts found)

## In-Depth Analysis
(Extensive analysis section for EACH sub-question, maintaining the header level ##)

## Cross-Domain Implications
(How these findings affect other sectors or future developments)

## Conclusion
(A rigorous synthesis of the research and its long-term outlook)

## References
(List the questions and the types of sources found based on the summaries)
"""
