import json
import logging

from groq import Groq, GroqError

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: Groq | None = None

GROQ_MODEL = "llama-3.3-70b-versatile"


def _get_client() -> Groq | None:
    global _client
    if not settings.groq_api_key:
        return None
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def generate_ai_insight(insight_type: str, metrics: dict) -> str | None:
    client = _get_client()
    if client is None or not settings.ai_insights_enabled:
        return None

    prompt = f"""You are a focus/productivity coach analyzing behavioral data.
Insight type: {insight_type}
Computed metrics (already calculated, do not recompute anything):
{json.dumps(metrics, default=str)}

Write a 2-3 sentence insight for the user: what the pattern means and one
concrete, specific action they could take. Be direct and encouraging, not
clinical. Do not invent numbers not present above."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip()
    except GroqError as exc:
        logger.warning("AI insight generation failed for %s: %s", insight_type, exc)
        return None


def generate_chat_reply(conversation: list[dict], data_context: dict) -> str:
    client = _get_client()
    if client is None or not settings.ai_insights_enabled:
        return (
            "AI chat isn't configured right now (no API key set), so I can't generate a response. "
            "You can still check the analytics endpoints directly for your data."
        )

    system_prompt = f"""You are FocusGuard AI's assistant, helping the user understand their own
focus, attention, and productivity data. Answer ONLY using the data below - do not invent
numbers, dates, or events that aren't present in it. If the data doesn't cover what they're
asking, say so plainly rather than guessing. Be concise, direct, and encouraging, not clinical.

User's computed data:
{json.dumps(data_context, default=str)}"""

    messages = [{"role": "system", "content": system_prompt}] + conversation

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=400,
            messages=messages,
        )
        return response.choices[0].message.content.strip()
    except GroqError as exc:
        logger.warning("Chat reply generation failed: %s", exc)
        return "Something went wrong generating a response - please try again in a moment."
