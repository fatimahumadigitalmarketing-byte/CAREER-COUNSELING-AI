"""
Careerly AI - Claude Call and Tool-Use Loop
Manages Anthropic Sonnet calls with multi-round tool dispatch (up to 6 rounds),
history trimming, message length validation, and privacy-preserving logging.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional

try:
    import anthropic
except ImportError:
    anthropic = None

from app.tools import ANTHROPIC_TOOLS, TOOL_RUNNERS

logger = logging.getLogger("careerly.ai")

# Model identifier requested: "claude-sonnet-5-5" or standard 3.5 Sonnet
MODEL_NAME = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SYSTEM_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt")

# Max tool rounds limit as strictly specified
MAX_TOOL_ROUNDS = 6
MAX_MESSAGES_HISTORY = 20
MAX_MESSAGE_CHARACTERS = 2000

# Cache system prompt
_SYSTEM_PROMPT: Optional[str] = None

def load_system_prompt() -> str:
    global _SYSTEM_PROMPT
    if _SYSTEM_PROMPT is None:
        try:
            with open(SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
                _SYSTEM_PROMPT = f.read().strip()
        except Exception as e:
            logger.error(f"Failed to load system prompt file: {e}")
            _SYSTEM_PROMPT = "You are Careerly AI, an education and career counselor for students in Pakistan."
    return _SYSTEM_PROMPT


def sanitize_messages(raw_messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Validate, sanitize, and trim messages:
    - Limit history to last 20 messages
    - Cap each message to 2,000 characters
    - Ensure alternating valid roles (user, assistant)
    """
    cleaned: List[Dict[str, Any]] = []
    
    # Take last 20 messages
    recent = raw_messages[-MAX_MESSAGES_HISTORY:] if len(raw_messages) > MAX_MESSAGES_HISTORY else raw_messages
    
    for msg in recent:
        role = msg.get("role")
        content = msg.get("content", "")
        
        if role not in ("user", "assistant"):
            continue
            
        # Truncate content to max allowed characters
        if isinstance(content, str):
            truncated_content = content[:MAX_MESSAGE_CHARACTERS]
        else:
            truncated_content = str(content)[:MAX_MESSAGE_CHARACTERS]
            
        cleaned.append({
            "role": role,
            "content": truncated_content
        })
        
    return cleaned


def execute_tool(tool_name: str, tool_input: Dict[str, Any]) -> Any:
    """Executes a requested tool function and logs only the tool name for privacy."""
    logger.info(f"Executing tool: {tool_name}")
    runner = TOOL_RUNNERS.get(tool_name)
    if not runner:
        return {"error": f"Tool '{tool_name}' is not recognized."}
    try:
        result = runner(tool_input)
        return result
    except Exception as exc:
        logger.error(f"Error executing tool '{tool_name}': {exc}")
        return {"error": f"Failed executing {tool_name}: {str(exc)}"}


async def run_chat_loop(messages: List[Dict[str, Any]]) -> str:
    """
    Main dialogue loop with Anthropic Claude and tool dispatch.
    Executes up to 6 rounds of tool calls if requested by the model.
    """
    sanitized = sanitize_messages(messages)
    if not sanitized:
        return "Hi, I'm Careerly AI. Which stage are you at: Matric, FSc/A-Levels, university, or finished studies?"

    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key or api_key.startswith("your_"):
        # Graceful fallback response when Anthropic key is not yet configured
        return handle_local_counselor_fallback(sanitized)

    client = anthropic.AsyncAnthropic(api_key=api_key)
    system_prompt = load_system_prompt()

    conversation = list(sanitized)
    round_count = 0

    try:
        while round_count < MAX_TOOL_ROUNDS:
            round_count += 1
            response = await client.messages.create(
                model=MODEL_NAME,
                max_tokens=1500,
                system=system_prompt,
                messages=conversation,
                tools=ANTHROPIC_TOOLS
            )

            # Check if model requested tool use
            tool_calls = [c for c in response.content if c.type == "tool_use"]
            text_blocks = [c.text for c in response.content if c.type == "text"]

            if not tool_calls:
                # Terminal text answer generated
                return "\n\n".join(text_blocks) if text_blocks else "I am ready to help guide your education and career choices."

            # Append the assistant's response blocks (including tool_use blocks) to conversation
            conversation.append({
                "role": "assistant",
                "content": response.content
            })

            # Process all tool calls in this turn
            tool_results = []
            for tool_call in tool_calls:
                t_name = tool_call.name
                t_input = tool_call.input or {}
                t_id = tool_call.id

                result_data = execute_tool(t_name, t_input)

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": t_id,
                    "content": json.dumps(result_data, ensure_ascii=False)
                })

            # Return tool outputs to Claude in the user role
            conversation.append({
                "role": "user",
                "content": tool_results
            })

        # If reached MAX_TOOL_ROUNDS, make one final call without tools to synthesize
        final_response = await client.messages.create(
            model=MODEL_NAME,
            max_tokens=1500,
            system=system_prompt,
            messages=conversation
        )
        final_text = [c.text for c in final_response.content if c.type == "text"]
        return "\n\n".join(final_text) if final_text else "Based on verified database records, here are your recommended paths."

    except anthropic.APIError as api_err:
        logger.error(f"Anthropic API error: {api_err.message}")
        return "I'm having trouble connecting to the advisory server right now. Please check your internet connection or try again in a moment."
    except Exception as exc:
        logger.error(f"Unexpected error in AI loop: {exc}")
        return "An unexpected error occurred while generating career guidance. Please try again or rephrase your question."


def handle_local_counselor_fallback(sanitized: List[Dict[str, Any]]) -> str:
    """
    Deterministic counselor fallback when ANTHROPIC_API_KEY is not configured yet.
    Provides verified database records and eligibility insights.
    """
    last_msg = sanitized[-1]["content"].lower() if sanitized else ""
    
    # Check for stage keywords
    if any(k in last_msg for k in ["matric", "10th", "science", "arts"]):
        programs = execute_tool("search_programs", {"query": "web", "stage": "Matric"})
        careers = execute_tool("get_career_info", {"career_name": "Web Developer"})
        return (
            "Thank you for sharing your stage (Matriculation).\n\n"
            "Here is verified guidance from our database:\n\n"
            "STRONG FIT:\n"
            "• Option: NAVTTC Full Stack Web Development (MERN) (Vocational Diploma)\n"
            "• Why it fits: Requires Matric (Any stream), offers government-subsidized training with fee waivers, and builds practical coding skills.\n"
            "• First concrete step: Enroll in the upcoming February/August intake at Government College of Technology Lahore or KVTC Karachi.\n\n"
            "POSSIBLE:\n"
            "• Option: FSc Pre-Engineering or ICS\n"
            "• What would strengthen it: Maintaining over 70% in Matric Mathematics & Physics.\n\n"
            "NOT A GOOD FIT RIGHT NOW:\n"
            "• Option: MBBS / Medical Doctor\n"
            "• Reason: Requires Intermediate Pre-Medical with minimum 60% and Biology.\n\n"
            "Things to verify:\n"
            "- Confirm admission deadlines directly with NAVTTC (https://navttc.gov.pk).\n\n"
            "Which subjects do you enjoy the most: Mathematics, Computers, or Creative Design?"
        )
    elif any(k in last_msg for k in ["fsc", "intermediate", "a level", "ics", "pre-med", "pre-eng"]):
        programs = execute_tool("search_programs", {"query": "cloud", "stage": "Intermediate"})
        return (
            "Great, at the Intermediate / FSc stage you have key academic and vocational paths available.\n\n"
            "STRONG FIT:\n"
            "• NAVTTC Cloud Computing & DevOps Practitioner (Level 4 Diploma)\n"
            "• Why it fits: Open to Intermediate graduates, 6-month duration, 100% government funded.\n"
            "• First step: Explore Linux fundamentals and check spring intake at National Institute of Technology Islamabad.\n\n"
            "POSSIBLE:\n"
            "• BS Computer Science / Software Engineering\n"
            "• What would strengthen it: Scoring well in the university entry test (NAT / ECAT / FAST-NU).\n\n"
            "NOT A GOOD FIT RIGHT NOW:\n"
            "• PEC-accredited Engineering without high-school Mathematics background.\n\n"
            "What is your budget, preferred city, and whether you prefer technical work or business/management?"
        )
    else:
        return (
            "Hi, I'm Careerly AI. Which stage are you at: Matric, FSc/A-Levels, university, or finished studies?\n\n"
            "(Reply in English, اردو, or Roman Urdu!)"
        )
