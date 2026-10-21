"""
Careerly AI - Eligibility Rules Unit Tests
Covers medical (MBBS/BDS), engineering (PEC), computing (HEC), commerce,
NAVTTC vocational courses, minimum education boundaries, and edge cases.
Requires at least 15 comprehensive test cases.
"""

import sys
import os

# Ensure app is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.eligibility import check_eligibility

try:
    import pytest
except ImportError:
    pytest = None


# =========================================================================
# MEDICAL TESTS (PMDC Regulations)
# =========================================================================

def test_mbbs_eligible_pre_medical():
    """1. FSc Pre-Medical student with Bio, Chem, Physics is eligible for MBBS."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Medical",
        subjects=["Biology", "Chemistry", "Physics"],
        program_id="mbbs"
    )
    assert res["eligible"] is True
    assert any("Prerequisite subjects verified" in r for r in res["reasons"])


def test_mbbs_ineligible_pre_engineering():
    """2. FSc Pre-Engineering student is ineligible for MBBS due to missing Biology."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Engineering",
        subjects=["Mathematics", "Physics", "Chemistry"],
        program_id="mbbs"
    )
    assert res["eligible"] is False
    assert any("Stream mismatch" in r or "Missing prerequisite subjects: Biology" in r for r in res["reasons"])


def test_bds_ineligible_matric():
    """3. Student with only Matric cannot apply for BDS (needs Intermediate)."""
    res = check_eligibility(
        education_level="Matric",
        stream="Science",
        subjects=["Biology", "Chemistry", "Physics"],
        program_id="bds"
    )
    assert res["eligible"] is False
    assert any("Requires at least Intermediate" in r for r in res["reasons"])


# =========================================================================
# ENGINEERING TESTS (PEC Regulations)
# =========================================================================

def test_engineering_eligible_pre_engineering():
    """4. FSc Pre-Engineering with Math & Physics is eligible for B.E. Engineering."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Engineering",
        subjects=["Mathematics", "Physics", "Chemistry"],
        program_id="engineering"
    )
    assert res["eligible"] is True
    assert any("Prerequisite subjects verified" in r for r in res["reasons"])


def test_engineering_ineligible_pre_medical_without_math():
    """5. Pre-medical student without additional math is ineligible for PEC engineering."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Medical",
        subjects=["Biology", "Chemistry", "Physics"],
        program_id="engineering"
    )
    assert res["eligible"] is False
    assert any("additional Mathematics" in r for r in res["reasons"])


def test_engineering_eligible_pre_medical_with_additional_math():
    """6. Pre-medical student with certified additional Mathematics is eligible."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Medical",
        subjects=["Biology", "Chemistry", "Physics", "Additional Mathematics"],
        program_id="engineering"
    )
    assert res["eligible"] is True
    assert any("additional Mathematics" in r for r in res["reasons"])


# =========================================================================
# COMPUTING & COMMERCE TESTS
# =========================================================================

def test_computer_science_eligible_ics():
    """7. ICS student with Math and CS is eligible for BS Computer Science."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="ICS",
        subjects=["Mathematics", "Computer Science", "Physics"],
        program_id="computer_science"
    )
    assert res["eligible"] is True


def test_computer_science_ineligible_arts_without_math():
    """8. FA / Humanities student without mathematics is ineligible for BS CS."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="FA Humanities",
        subjects=["History", "Civics", "Islamic Studies"],
        program_id="computer_science"
    )
    assert res["eligible"] is False
    assert any("Mathematics" in r for r in res["reasons"])


def test_bba_eligible_any_stream():
    """9. BBA is open to all intermediate streams (I.Com, FA, FSc, ICS)."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="I.Com",
        subjects=["Accounting", "Commerce", "Economics"],
        program_id="bba"
    )
    assert res["eligible"] is True


# =========================================================================
# NAVTTC VOCATIONAL COURSES TESTS
# =========================================================================

def test_navttc_web_dev_matric_eligible():
    """10. NAVTTC Full Stack Web Development (Program 2) accepts Matric students."""
    res = check_eligibility(
        education_level="Matric",
        stream="Arts",
        subjects=["General Science", "English"],
        program_id="2"
    )
    assert res["eligible"] is True


def test_navttc_cloud_computing_matric_ineligible():
    """11. NAVTTC Cloud Computing (Program 1) requires Intermediate or CS background."""
    res = check_eligibility(
        education_level="Matric",
        stream="Arts",
        subjects=["Civics", "General Science"],
        program_id="1"
    )
    assert res["eligible"] is False
    assert any("Requires at least Intermediate" in r for r in res["reasons"])


def test_navttc_cloud_computing_intermediate_eligible():
    """12. NAVTTC Cloud Computing accepts Intermediate graduate."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="ICS",
        subjects=["Computer Science", "Mathematics"],
        program_id="1"
    )
    assert res["eligible"] is True


def test_navttc_solar_pv_science_matric():
    """13. NAVTTC Solar PV Technician (Program 5) is eligible with Matric Science (Physics)."""
    res = check_eligibility(
        education_level="Matric",
        stream="Science",
        subjects=["Physics", "Chemistry", "Mathematics"],
        program_id="5"
    )
    assert res["eligible"] is True


def test_navttc_clinical_assistant_requires_biology():
    """14. Clinical Assistant (Program 10) requires Biology background."""
    res = check_eligibility(
        education_level="Matric",
        stream="Arts",
        subjects=["General Math", "Civics"],
        program_id="10"
    )
    assert res["eligible"] is False
    assert any("Biology" in r for r in res["reasons"])


# =========================================================================
# EDGE CASES & BOUNDARIES
# =========================================================================

def test_below_matric_ineligible():
    """15. Student with Middle / below Matric fails minimum stage check."""
    res = check_eligibility(
        education_level="Middle",
        stream="General",
        subjects=[],
        program_id="2"
    )
    assert res["eligible"] is False
    assert any("below Matriculation" in r or "not met" in r for r in res["reasons"])


def test_unrecognized_program_fallback():
    """16. Unrecognized program returns safe guidance with manual verification prompt."""
    res = check_eligibility(
        education_level="Intermediate",
        stream="Pre-Engineering",
        subjects=["Mathematics", "Physics"],
        program_id="unknown_external_course_999"
    )
    assert res["eligible"] is True
    assert any("Confirm institute-specific" in r for r in res["reasons"])


if __name__ == "__main__":
    test_functions = [
        test_mbbs_eligible_pre_medical,
        test_mbbs_ineligible_pre_engineering,
        test_bds_ineligible_matric,
        test_engineering_eligible_pre_engineering,
        test_engineering_ineligible_pre_medical_without_math,
        test_engineering_eligible_pre_medical_with_additional_math,
        test_computer_science_eligible_ics,
        test_computer_science_ineligible_arts_without_math,
        test_bba_eligible_any_stream,
        test_navttc_web_dev_matric_eligible,
        test_navttc_cloud_computing_matric_ineligible,
        test_navttc_cloud_computing_intermediate_eligible,
        test_navttc_solar_pv_science_matric,
        test_navttc_clinical_assistant_requires_biology,
        test_below_matric_ineligible,
        test_unrecognized_program_fallback,
    ]
    for func in test_functions:
        func()
        print(f"PASS: {func.__name__}")
    print(f"\nAll {len(test_functions)} tests passed successfully!")

