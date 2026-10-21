"""
Careerly AI - Tool Functions and Anthropic JSON Schemas
Implements the 4 core tools:
1. search_programs
2. get_program_details
3. check_eligibility
4. get_career_info
"""

import json
from typing import List, Dict, Any, Optional
from app.db import search_programs_db, get_program_details_db, get_career_info_db
from app.eligibility import check_eligibility as evaluate_eligibility


# =========================================================================
# TOOL IMPLEMENTATIONS (Python Callables returning JSON / Dicts)
# =========================================================================

def tool_search_programs(
    query: Optional[str] = None,
    stage: Optional[str] = None,
    city: Optional[str] = None,
    max_fee: Optional[float] = None,
    max_duration_months: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    Search courses and programs in the database by interest/query and structured filters.
    Returns up to 5 results with id, name, type, duration, fee, city, source_url, last_verified_date.
    Never fabricates data; returns empty list if no matches.
    """
    results = search_programs_db(
        query=query,
        stage=stage,
        city=city,
        max_fee=max_fee,
        max_duration_months=max_duration_months
    )
    return results


def tool_get_program_details(program_id: int) -> Dict[str, Any]:
    """
    Get complete details of a specific course or academic program by its ID.
    Includes outline, eligibility requirements, institutes offering it, source, and verified date.
    """
    details = get_program_details_db(program_id)
    if not details:
        return {"error": f"No program found with ID {program_id}. Verify ID or use search_programs."}
    return details


def tool_check_eligibility(
    education_level: str,
    stream: Optional[str] = None,
    subjects: Optional[Any] = None,
    program_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes deterministic eligibility rules for Pakistani education streams and NAVTTC requirements.
    Hard rules live in code (app/eligibility.py), not in prompt memory.
    """
    return evaluate_eligibility(
        education_level=education_level,
        stream=stream,
        subjects=subjects,
        program_id=str(program_id) if program_id is not None else None
    )


def tool_get_career_info(career_name: str) -> Dict[str, Any]:
    """
    Retrieves career roles, required technical & soft skills, typical entry pathways,
    and approximate entry-level salary notes.
    """
    career = get_career_info_db(career_name)
    if not career:
        return {"error": f"No verified career record found for '{career_name}'. Advise student to verify with sector experts."}
    return career


# Map function names to callables
TOOL_RUNNERS = {
    "search_programs": lambda kwargs: tool_search_programs(**kwargs),
    "get_program_details": lambda kwargs: tool_get_program_details(**kwargs),
    "check_eligibility": lambda kwargs: tool_check_eligibility(**kwargs),
    "get_career_info": lambda kwargs: tool_get_career_info(**kwargs)
}


# =========================================================================
# ANTHROPIC TOOL DEFINITIONS (JSON Schemas for Claude Sonnet 3.5 tool use)
# =========================================================================

ANTHROPIC_TOOLS = [
    {
        "name": "search_programs",
        "description": "Find verified academic programs and NAVTTC vocational courses in Pakistan matching student interests, education stage, city, budget, or duration. Returns up to 5 verified results from the database.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Topic, skill, or keyword to search for, e.g. 'web development', 'solar technician', 'ai', 'cloud', 'graphic design'."
                },
                "stage": {
                    "type": "string",
                    "description": "Education level stage filter, e.g. 'Matric', 'Intermediate', 'Graduation'."
                },
                "city": {
                    "type": "string",
                    "description": "City in Pakistan, e.g. 'Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta'."
                },
                "max_fee": {
                    "type": "number",
                    "description": "Maximum budget fee in PKR (use 0 for free/government funded NAVTTC courses)."
                },
                "max_duration_months": {
                    "type": "integer",
                    "description": "Maximum program duration in months (e.g. 3, 6, 12, 24, 48)."
                }
            }
        }
    },
    {
        "name": "get_program_details",
        "description": "Fetch the full verified record for a program using its numeric ID, including curriculum outline, eligibility, offering institutes, city, fee, stipend, source URL, and last-verified date.",
        "input_schema": {
            "type": "object",
            "properties": {
                "program_id": {
                    "type": "integer",
                    "description": "The exact ID of the program returned from search_programs."
                }
            },
            "required": ["program_id"]
        }
    },
    {
        "name": "check_eligibility",
        "description": "Executes hard Pakistani regulatory eligibility checks (HEC, PMDC, PEC, NAVTTC) in plain Python code. Determines if a student's education stage, stream (e.g. Pre-Medical, Pre-Engineering, ICS, Arts), and subjects qualify for a specific program.",
        "input_schema": {
            "type": "object",
            "properties": {
                "education_level": {
                    "type": "string",
                    "description": "Student current or completed education stage: 'Matric', 'Intermediate', 'Bachelors', or 'Middle'."
                },
                "stream": {
                    "type": "string",
                    "description": "Academic stream group: 'Pre-Medical', 'Pre-Engineering', 'ICS', 'I.Com', 'Arts/Humanities', or 'Science'."
                },
                "subjects": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Key subjects studied, e.g. ['Biology', 'Physics', 'Chemistry'] or ['Mathematics', 'Computer Science']."
                },
                "program_id": {
                    "type": "string",
                    "description": "The program ID or program key (e.g. '1', '2', 'mbbs', 'engineering', 'computer_science')."
                }
            },
            "required": ["education_level"]
        }
    },
    {
        "name": "get_career_info",
        "description": "Retrieves verified career details from the database including role responsibilities, required skills, typical entry path in Pakistan, and approximate salary note.",
        "input_schema": {
            "type": "object",
            "properties": {
                "career_name": {
                    "type": "string",
                    "description": "Name or keyword of the career, e.g. 'Frontend Developer', 'DevOps', 'UI/UX Designer', 'Solar Technician'."
                }
            },
            "required": ["career_name"]
        }
    }
]
