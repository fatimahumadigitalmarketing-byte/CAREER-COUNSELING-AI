"""
Careerly AI - Chat AI Loop & Tool Dispatch Unit Tests
Mocks Anthropic Claude messages API to verify:
1. Tool call execution and loop handling
2. Strict 6-round loop termination
3. Empty search results resilience (no halluncinations)
4. Message sanitization and history truncation
"""

import sys
import os
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

try:
    import pytest
except ImportError:
    class DummyPytest:
        class mark:
            @staticmethod
            def asyncio(f):
                return f
    pytest = DummyPytest()

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if "anthropic" not in sys.modules:
    sys.modules["anthropic"] = MagicMock()

from app.ai import sanitize_messages, run_chat_loop, MAX_TOOL_ROUNDS, MAX_MESSAGE_CHARACTERS, MAX_MESSAGES_HISTORY
from app.tools import tool_search_programs


def test_sanitize_messages_truncation():
    """Verify history truncation to 20 messages and length limit to 2,000 characters."""
    # 25 messages, each with over 2500 characters
    oversized = [{"role": "user" if i % 2 == 0 else "assistant", "content": "A" * 2500} for i in range(25)]
    sanitized = sanitize_messages(oversized)

    assert len(sanitized) == MAX_MESSAGES_HISTORY
    for msg in sanitized:
        assert len(msg["content"]) <= MAX_MESSAGE_CHARACTERS


def test_empty_search_programs():
    """Verify search_programs returns empty list or safe fallback without inventing facts."""
    res = tool_search_programs(query="nonexistent_alien_technology_trade", max_fee=-10)
    assert isinstance(res, list)
    # When no results match fee/query, returns empty or safe empty list
    for item in res:
        assert "source_url" in item
        assert "last_verified_date" in item


@pytest.mark.asyncio
async def test_chat_loop_single_turn_no_tools():
    """Verify standard single response when Claude generates text directly."""
    mock_response = MagicMock()
    mock_content = MagicMock()
    mock_content.type = "text"
    mock_content.text = "Hi, I am Careerly AI. Which stage of education are you currently in?"
    mock_response.content = [mock_content]

    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "sk-ant-test-key-mock"}):
        with patch("anthropic.AsyncAnthropic") as mock_anthropic_class:
            mock_client = MagicMock()
            mock_client.messages.create = AsyncMock(return_value=mock_response)
            mock_anthropic_class.return_value = mock_client

            reply = await run_chat_loop([{"role": "user", "content": "Hello!"}])
            assert "Careerly AI" in reply
            assert mock_client.messages.create.await_count == 1


@pytest.mark.asyncio
async def test_chat_loop_tool_execution():
    """Verify tool call dispatch when Claude issues a tool_use request."""
    # Turn 1: tool call for search_programs
    tool_call = MagicMock()
    tool_call.type = "tool_use"
    tool_call.name = "search_programs"
    tool_call.id = "tool_call_abc123"
    tool_call.input = {"query": "web development"}

    resp1 = MagicMock()
    resp1.content = [tool_call]

    # Turn 2: final answer after tool result
    resp2_text = MagicMock()
    resp2_text.type = "text"
    resp2_text.text = "Based on our database, NAVTTC Full Stack Web Development is a strong fit for you."
    resp2 = MagicMock()
    resp2.content = [resp2_text]

    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "sk-ant-test-key-mock"}):
        with patch("anthropic.AsyncAnthropic") as mock_anthropic_class:
            mock_client = MagicMock()
            mock_client.messages.create = AsyncMock(side_effect=[resp1, resp2])
            mock_anthropic_class.return_value = mock_client

            reply = await run_chat_loop([{"role": "user", "content": "I want to learn web development"}])
            assert "Web Development" in reply
            assert mock_client.messages.create.await_count == 2


@pytest.mark.asyncio
async def test_chat_loop_enforces_max_six_rounds():
    """Verify tool loop terminates strictly at MAX_TOOL_ROUNDS (6) if tools are perpetually called."""
    tool_call = MagicMock()
    tool_call.type = "tool_use"
    tool_call.name = "search_programs"
    tool_call.id = "tool_loop_id"
    tool_call.input = {"query": "tech"}

    repeating_tool_resp = MagicMock()
    repeating_tool_resp.content = [tool_call]

    final_resp_text = MagicMock()
    final_resp_text.type = "text"
    final_resp_text.text = "Reached 6 rounds of retrieval. Here is your synthesized summary."
    final_resp = MagicMock()
    final_resp.content = [final_resp_text]

    # Side effect: 6 tool calls, followed by 1 synthesis call
    responses = [repeating_tool_resp] * MAX_TOOL_ROUNDS + [final_resp]

    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "sk-ant-test-key-mock"}):
        with patch("anthropic.AsyncAnthropic") as mock_anthropic_class:
            mock_client = MagicMock()
            mock_client.messages.create = AsyncMock(side_effect=responses)
            mock_anthropic_class.return_value = mock_client

            reply = await run_chat_loop([{"role": "user", "content": "Find courses"}])
            # Total calls should be MAX_TOOL_ROUNDS (6) + 1 final synthesis = 7
            assert mock_client.messages.create.await_count == MAX_TOOL_ROUNDS + 1
            assert "synthesized summary" in reply


if __name__ == "__main__":
    test_sanitize_messages_truncation()
    print("PASS: test_sanitize_messages_truncation")
    test_empty_search_programs()
    print("PASS: test_empty_search_programs")
    asyncio.run(test_chat_loop_single_turn_no_tools())
    print("PASS: test_chat_loop_single_turn_no_tools")
    asyncio.run(test_chat_loop_tool_execution())
    print("PASS: test_chat_loop_tool_execution")
    asyncio.run(test_chat_loop_enforces_max_six_rounds())
    print("PASS: test_chat_loop_enforces_max_six_rounds")
    print("\nAll chat AI loop and tool tests passed successfully!")

