"""
Careerly AI - Hard Eligibility Rules Engine
Contains deterministic verification rules for Pakistani academic programs,
university degrees, and NAVTTC vocational training courses.
"""

from typing import List, Dict, Any, Optional

# Education level ordinal ranking
EDUCATION_LEVEL_HIERARCHY: Dict[str, int] = {
    "middle": 1,
    "below_matric": 1,
    "matric": 2,
    "matriculation": 2,
    "ssc": 2,
    "10th": 2,
    "intermediate": 3,
    "fsc": 3,
    "f.sc": 3,
    "hssc": 3,
    "12th": 3,
    "a_levels": 3,
    "a-levels": 3,
    "alevels": 3,
    "dae": 3,
    "diploma": 3,
    "bachelors": 4,
    "bs": 4,
    "ba": 4,
    "bsc": 4,
    "bcom": 4,
    "bba": 4,
    "undergraduate": 4,
    "graduation": 4,
    "masters": 5,
    "ms": 5,
    "mphil": 5,
    "postgraduate": 5,
    "phd": 6
}

def normalize_string(val: Optional[str]) -> str:
    if not val:
        return ""
    return val.strip().lower().replace("-", " ").replace(".", "").replace("/", " ")

def normalize_education_level(level: str) -> str:
    cleaned = normalize_string(level)
    for key in sorted(EDUCATION_LEVEL_HIERARCHY.keys(), key=lambda k: -len(k)):
        if key in cleaned:
            return key
    return cleaned

def parse_subjects(subjects: Any) -> List[str]:
    if not subjects:
        return []
    if isinstance(subjects, list):
        return [normalize_string(str(s)) for s in subjects]
    if isinstance(subjects, str):
        # comma or slash separated
        parts = subjects.replace("/", ",").split(",")
        return [normalize_string(p) for p in parts if p.strip()]
    return []

def get_level_rank(level_str: str) -> int:
    norm = normalize_education_level(level_str)
    return EDUCATION_LEVEL_HIERARCHY.get(norm, 0)

# Known program requirements lookup when program_id matches seeded programs or academic majors
PROGRAM_RULE_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    # Academic University Degrees
    "mbbs": {
        "min_education": "intermediate",
        "allowed_streams": ["pre medical", "fsc pre medical", "a levels pre medical", "biology"],
        "required_subjects": ["biology", "chemistry", "physics"],
        "description": "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
        "notes": "PMDC regulations mandate FSc Pre-Medical (or A-Levels with Bio, Chem, Physics) with minimum 60% and MDCAT passing score."
    },
    "bds": {
        "min_education": "intermediate",
        "allowed_streams": ["pre medical", "fsc pre medical", "a levels pre medical", "biology"],
        "required_subjects": ["biology", "chemistry", "physics"],
        "description": "BDS (Bachelor of Dental Surgery)",
        "notes": "PMDC requires FSc Pre-Medical with Biology, Chemistry, and Physics, plus MDCAT."
    },
    "pharm_d": {
        "min_education": "intermediate",
        "allowed_streams": ["pre medical", "fsc pre medical"],
        "required_subjects": ["biology", "chemistry"],
        "description": "Pharm-D (Doctor of Pharmacy)",
        "notes": "Pharmacy Council of Pakistan requires FSc Pre-Medical background."
    },
    "engineering": { # B.E. / B.Sc. Engineering (Electrical, Mechanical, Civil, Software)
        "min_education": "intermediate",
        "allowed_streams": ["pre engineering", "fsc pre engineering", "ics with physics", "dae"],
        "required_subjects": ["mathematics", "physics"],
        "description": "B.Sc. / B.E. Engineering Programs (PEC Recognized)",
        "notes": "Pakistan Engineering Council (PEC) strictly mandates Mathematics and Physics at Intermediate level. Pre-Medical students must pass additional Mathematics before entry test."
    },
    "computer_science": { # BS Computer Science / BS Software Engineering
        "min_education": "intermediate",
        "allowed_streams": ["ics", "pre engineering", "general science", "pre medical with additional math", "dae it"],
        "required_subjects": ["mathematics"],
        "description": "BS Computer Science / Software Engineering (HEC/NCEAC)",
        "notes": "HEC requires Mathematics at Intermediate (12th) level (or passing deficiency mathematics coursework)."
    },
    "bba": { # Bachelor of Business Administration
        "min_education": "intermediate",
        "allowed_streams": ["any", "icom", "ics", "fa", "fsc pre engineering", "fsc pre medical"],
        "required_subjects": [],
        "description": "BBA (Bachelor of Business Administration)",
        "notes": "Open to all intermediate streams (FA, FSc, I.Com, ICS, A-Levels)."
    },
    # Seeded NAVTTC Programs by numeric ID (string keys)
    "1": { # Cloud Computing & DevOps
        "min_education": "intermediate",
        "allowed_streams": ["any", "ics", "pre engineering", "fa", "fsc", "matric computer science"],
        "required_subjects": [],
        "notes": "Requires Intermediate or Matric with Computer Science; comfortable with computers."
    },
    "2": { # Full Stack Web Dev
        "min_education": "matric",
        "allowed_streams": ["any"],
        "required_subjects": [],
        "notes": "Open to all Matric pass students (Science or Arts)."
    },
    "3": { # Python & AI Basics
        "min_education": "intermediate",
        "allowed_streams": ["ics", "pre engineering", "fsc", "matric science"],
        "required_subjects": ["mathematics"],
        "notes": "Intermediate or Matric Science; basic high-school math skills required."
    },
    "4": { # Graphic Design & UI/UX
        "min_education": "matric",
        "allowed_streams": ["any"],
        "required_subjects": [],
        "notes": "Matriculation (Arts or Science); no technical prerequisite."
    },
    "5": { # Solar PV Technician
        "min_education": "matric",
        "allowed_streams": ["science", "matric science", "technical", "any"],
        "required_subjects": ["physics"],
        "notes": "Matric with Science/Physics preferred for understanding voltage and circuit load."
    },
    "6": { # Mobile App Development (Flutter)
        "min_education": "intermediate",
        "allowed_streams": ["any", "ics", "fsc", "fa"],
        "required_subjects": [],
        "notes": "Intermediate or Matric with coding foundation."
    },
    "7": { # Digital Marketing & SEO
        "min_education": "matric",
        "allowed_streams": ["any"],
        "required_subjects": [],
        "notes": "Open to Matric in any group; smartphone or basic computer familiarity."
    },
    "8": { # Industrial Electrician
        "min_education": "matric",
        "allowed_streams": ["science", "technical"],
        "required_subjects": ["physics"],
        "notes": "Matric Science or Technical stream; foundation in basic physics."
    },
    "9": { # Cybersecurity Analyst
        "min_education": "intermediate",
        "allowed_streams": ["ics", "pre engineering", "computer science"],
        "required_subjects": ["mathematics"],
        "notes": "Intermediate (ICS/Pre-Engineering) with Mathematics and Computing."
    },
    "10": { # Clinical Assistant & Healthcare Support
        "min_education": "matric",
        "allowed_streams": ["science", "matric science", "biology"],
        "required_subjects": ["biology"],
        "notes": "Matric Science with Biology required for clinical and anatomical understanding."
    }
}


def check_eligibility(
    education_level: str,
    stream: Optional[str] = None,
    subjects: Optional[Any] = None,
    program_id: Optional[str] = None,
    program_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates whether a student meets the deterministic criteria for a program.
    Returns:
        {
            "eligible": bool,
            "reasons": list[str]
        }
    """
    reasons: List[str] = []
    is_eligible = True

    student_rank = get_level_rank(education_level)
    student_stream = normalize_string(stream)
    student_subjects = [s.lower() for s in parse_subjects(subjects)]

    # Determine rule lookup key
    lookup_key: Optional[str] = None
    if program_id and str(program_id).strip() in PROGRAM_RULE_DEFINITIONS:
        lookup_key = str(program_id).strip()
    elif program_name:
        p_name = normalize_string(program_name)
        if "mbbs" in p_name:
            lookup_key = "mbbs"
        elif "dental" in p_name or "bds" in p_name:
            lookup_key = "bds"
        elif "pharm" in p_name:
            lookup_key = "pharm_d"
        elif "engineering" in p_name and not "computer" in p_name and not "software" in p_name:
            lookup_key = "engineering"
        elif "computer science" in p_name or "software engineering" in p_name or "cs" in p_name or "se" in p_name:
            lookup_key = "computer_science"
        elif "bba" in p_name or "business administration" in p_name:
            lookup_key = "bba"
        elif "cloud" in p_name:
            lookup_key = "1"
        elif "web" in p_name:
            lookup_key = "2"
        elif "python" in p_name or "artificial intelligence" in p_name:
            lookup_key = "3"
        elif "graphic" in p_name or "ui" in p_name:
            lookup_key = "4"
        elif "solar" in p_name:
            lookup_key = "5"
        elif "mobile" in p_name or "flutter" in p_name:
            lookup_key = "6"
        elif "marketing" in p_name or "seo" in p_name:
            lookup_key = "7"
        elif "electrician" in p_name:
            lookup_key = "8"
        elif "cyber" in p_name:
            lookup_key = "9"
        elif "clinical" in p_name or "health" in p_name:
            lookup_key = "10"

    rule = PROGRAM_RULE_DEFINITIONS.get(lookup_key) if lookup_key else None

    if not rule:
        # Default fallback check if rule is not in dictionary:
        # Check standard minimum education
        if student_rank < 2:
            reasons.append("Student education level is below Matriculation. Most recognized programs require at least Matric.")
            return {"eligible": False, "reasons": reasons}
        return {
            "eligible": True,
            "reasons": [f"Basic education requirement met ({education_level.title()}). Confirm institute-specific criteria and quotas directly."]
        }

    # 1. Check Minimum Education Level
    min_edu = rule.get("min_education", "matric")
    min_rank = get_level_rank(min_edu)

    if student_rank < min_rank:
        is_eligible = False
        reasons.append(
            f"Education requirement not met: Requires at least {min_edu.title()} level (student has {education_level.title() or 'None'})."
        )
    else:
        reasons.append(f"Minimum academic stage satisfied: {education_level.title()} meets or exceeds {min_edu.title()}.")

    # 2. Check Required Streams
    allowed_streams = rule.get("allowed_streams", ["any"])
    if "any" not in allowed_streams and allowed_streams:
        stream_matches = False
        for allowed in allowed_streams:
            if allowed in student_stream or any(allowed in subj for subj in student_subjects):
                stream_matches = True
                break
        
        # Pre-medical check for engineering/CS
        if lookup_key in ("engineering", "computer_science") and "medical" in student_stream:
            # Pre-medical students can do CS or Engineering ONLY if they took additional math
            has_math = any("math" in s for s in student_subjects)
            if has_math:
                stream_matches = True
                reasons.append("Pre-Medical background accepted because student passed additional Mathematics.")
            else:
                is_eligible = False
                reasons.append(
                    "FSc Pre-Medical students require an additional Mathematics exam certificate to qualify for PEC Engineering / Computing admissions."
                )
        elif not stream_matches and student_stream:
            is_eligible = False
            reasons.append(
                f"Stream mismatch: Requires background in {', '.join(allowed_streams).title()}, but student stream is '{stream.title() if stream else 'Unspecified'}'."
            )

    # 3. Check Required Subjects
    required_subjects = rule.get("required_subjects", [])
    if required_subjects:
        missing_subjects = []
        for req in required_subjects:
            req_norm = req.lower()
            # check in subjects or in stream name
            has_subj = any(req_norm in s for s in student_subjects) or (req_norm in student_stream)
            # handle bio in pre-med
            if req_norm == "biology" and "medical" in student_stream:
                has_subj = True
            # handle math in pre-engineering or ics
            if req_norm == "mathematics" and ("engineering" in student_stream or "ics" in student_stream):
                has_subj = True
            # handle physics in pre-engineering or pre-medical
            if req_norm == "physics" and ("engineering" in student_stream or "medical" in student_stream):
                has_subj = True

            if not has_subj:
                missing_subjects.append(req.title())

        if missing_subjects:
            is_eligible = False
            reasons.append(
                f"Missing prerequisite subjects: {', '.join(missing_subjects)}. These are compulsory for this stream/course."
            )
        else:
            reasons.append(f"Prerequisite subjects verified ({', '.join(required_subjects).title()}).")

    # Add official notes if applicable
    if rule.get("notes"):
        reasons.append(f"Note: {rule['notes']}")

    return {
        "eligible": is_eligible,
        "reasons": reasons
    }
