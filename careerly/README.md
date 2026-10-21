# Careerly AI (کیریئرلی اے آئی)
> AI-Powered Career and Education Counselor for Pakistani Students  
> Matriculation • Intermediate / FSc • University • NAVTTC Vocational Skills

Careerly AI delivers transparent, data-grounded educational guidance for youth across Pakistan. All course facts and institutional data come exclusively from verified database records (never from hallucinated LLM memory). Deterministic regulatory rules (HEC, PMDC, PEC, NAVTTC) are enforced in plain Python code.

---

## Architecture & Technology Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, SlowAPI (IP rate limiting)
- **AI Core**: Anthropic Claude (`claude-sonnet-5-5` / `claude-3-5-sonnet-20241022`) with multi-round tool use (max 6 rounds)
- **Database**: PostgreSQL 16 with `pgvector` extension for semantic HNSW vector similarity
- **Embeddings**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384 dimensions) supporting English, Urdu (اردو), and Roman Urdu
- **Curriculum Loader**: PDF ingestion via `pdfplumber` with Tesseract OCR fallback for scanned Urdu/English documents
- **Frontend**: Clean single-page application (HTML5, accessible CSS design tokens, Vanilla JavaScript), zero bloated frameworks

---

## Color System & Visual Identity

The design adheres strictly to the official palette:
- `--green`: `#12593A` (Primary identity, badges, borders)
- `--green-dark`: `#0C3F29` (Hero background, header, footer)
- `--green-soft`: `#E4EFE9` (Section backgrounds, subtle containers)
- `--yellow`: `#EBDA15` (Interactive primary buttons with green text only)
- `--bg`: `#F8F8F8`
- `--text`: `#1F2A24`

---

## Folder Structure

```
careerly/
├── app/
│   ├── main.py                     # FastAPI API routes: GET /, POST /chat, GET /health
│   ├── ai.py                       # Claude Sonnet tool loop & history manager
│   ├── tools.py                    # 4 AI tools & Anthropic JSON schemas
│   ├── eligibility.py              # Hard deterministic rules in plain Python
│   ├── db.py                       # PostgreSQL + pgvector queries & verified store
│   └── prompts/
│       └── system_prompt.txt       # Verbatim counselor instructions
├── db/
│   └── schema.sql                  # PostgreSQL schema, vector index, and sample data
├── data/
│   └── navttc_pdfs/                # Directory for raw official NAVTTC curriculum PDFs
├── scripts/
│   └── load_navttc.py              # PDF extraction, OCR, chunking, and embedding script
├── static/
│   ├── index.html                  # Accessible multilingual landing & chat UI
│   ├── style.css                   # Responsive CSS with exact color tokens
│   ├── app.js                      # Client state, XSS-safe textContent chat rendering
│   └── images/                     # hero.jpg, matric.jpg, intermediate.jpg, university.jpg, skills.jpg
├── tests/
│   ├── test_eligibility.py         # 16 unit tests for hard eligibility logic
│   ├── test_chat.py                # Mocked Anthropic client & tool loop tests
│   └── sample_students.md          # 8 student personas for manual QA & fairness audit
├── docker-compose.yml              # PostgreSQL + pgvector container definition
├── requirements.txt                # Python package dependencies
├── .env.example                    # Template environment variables
├── .gitignore                      # Git exclusion rules
└── README.md                       # Documentation & operations guide
```

---

## Local Setup & Quickstart

### 1. Clone & Setup Virtual Environment
```bash
cd careerly
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and supply your Anthropic API Key:
```ini
ANTHROPIC_API_KEY=sk-ant-api03-...
DATABASE_URL=postgresql://careerly_user:careerly_password@localhost:5432/careerly_db
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
EMBEDDING_DIM=384
```

### 3. Start Database via Docker
```bash
docker-compose up -d db
```
Wait 5 seconds for PostgreSQL to initialize the schema from `db/schema.sql`.

Alternatively, if running standalone PostgreSQL:
```bash
psql -U postgres -c "CREATE DATABASE careerly_db;"
psql -U postgres -d careerly_db -f db/schema.sql
```

### 4. Run NAVTTC PDF Ingestion (Optional)
Drop official NAVTTC curriculum PDFs into `data/navttc_pdfs/`, then run:
```bash
# Preview without writing:
python scripts/load_navttc.py --dry-run

# Ingest and embed into PostgreSQL:
python scripts/load_navttc.py
```

### 5. Launch the Application Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Open your browser at:
- Web App UI: `http://localhost:8000`
- API Health: `http://localhost:8000/health`
- Swagger Docs: `http://localhost:8000/docs`

---

## Running Automated Tests

Run the test suite with `pytest`:
```bash
pytest -v tests/
```
Tests verify:
- At least 15 deterministic eligibility cases (Medical, PEC Engineering, Computing, NAVTTC minimum entry requirements).
- Anthropic Claude tool-use loop with 6-round maximum execution ceiling.
- Empty search results handling and message history sanitization.

---

## How to Replace Sample Data with Real NAVTTC Data

All sample records in `db/schema.sql` are prefixed with `[SAMPLE]`.
To replace them with live official data:
1. Delete sample rows:
   ```sql
   DELETE FROM programs WHERE name LIKE '[SAMPLE]%';
   DELETE FROM careers WHERE name LIKE '[SAMPLE]%';
   DELETE FROM institutions WHERE name LIKE '[SAMPLE]%';
   ```
2. Download official PDF curricula from [NAVTTC National Curricula Repository](https://navttc.gov.pk).
3. Place files in `data/navttc_pdfs/`.
4. Run `python scripts/load_navttc.py`.
5. The script will automatically parse modules, extract NVQF levels, compute 384-dimensional embeddings, and link chunks to `programs` and `program_chunks`.

---

## How to Add New Eligibility Rules

Hard eligibility rules live in `app/eligibility.py` within `PROGRAM_RULE_DEFINITIONS`:
```python
"new_program_key": {
    "min_education": "intermediate", # "matric", "intermediate", "bachelors"
    "allowed_streams": ["pre engineering", "ics"],
    "required_subjects": ["mathematics", "physics"],
    "notes": "Specific regulatory notification and quota requirements."
}
```
Add corresponding test cases in `tests/test_eligibility.py` to preserve deterministic guarantees.

---

## Mandatory Human Review & Operational Checklist

Before publishing this application in a live production environment with real students, you must complete the following manual steps:

- [ ] **Add Photos**: Replace placeholder images in `static/images/` (`hero.jpg`, `matric.jpg`, `intermediate.jpg`, `university.jpg`, `skills.jpg`) with verified, rights-cleared Pakistani student photographs.
- [ ] **Load Real NAVTTC PDFs**: Ingest 30–50 authentic curriculum PDFs via `scripts/load_navttc.py` to expand course coverage beyond the 10 initial samples.
- [ ] **Verify Urdu Text & Fonts**: Ensure Noto Nastaliq Urdu renders smoothly across mobile Chrome and Safari, and verify Nastaliq line heights (`line-height: 2.1`).
- [ ] **Professional Counselor Audit**: Have a certified education counselor from Pakistan review the first 50 to 100 actual chat interactions against `tests/sample_students.md`.
- [ ] **Fairness & Neutrality Check**: Audit responses to confirm the AI treats girls and boys, and rural and urban students, with equal ambition, offering scholarships and stipends rather than lowering expectations.
- [ ] **Logo & Trademark Permission**: Confirm written authorization with NAVTTC and HEC public relations before displaying any official government logos or emblems.
