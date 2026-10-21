#!/usr/bin/env python3
"""
Careerly AI - NAVTTC PDF to Database Ingestion Script
Extracts curriculum documents, performs OCR on scanned pages, supports Urdu/English,
chunks text into module-level sections, computes multilingual embeddings,
and stores records into PostgreSQL with pgvector.
"""

import os
import sys
import glob
import re
import argparse
import datetime
import logging
from typing import List, Dict, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("navttc_loader")

# Try importing PDF and OCR libraries with graceful warnings
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    psycopg2 = None

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "384"))
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://careerly_user:careerly_password@localhost:5432/careerly_db")


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text using pdfplumber, falling back to pytesseract OCR
    for scanned or image-only pages, supporting both English and Urdu text.
    """
    if pdfplumber is None:
        logger.warning("pdfplumber is not installed. Unable to parse PDF.")
        return ""

    full_text_pages: List[str] = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_idx, page in enumerate(pdf.pages):
                page_text = page.extract_text() or ""
                
                # If page contains little to no text, attempt OCR fallback
                if len(page_text.strip()) < 50 and pytesseract and Image:
                    try:
                        # Extract page image for OCR
                        page_image = page.to_image(resolution=300).original
                        # OCR with both English and Urdu language models if installed
                        try:
                            ocr_text = pytesseract.image_to_string(page_image, lang="eng+urd")
                        except Exception:
                            # Fallback to English OCR if urd tessdata is not installed
                            ocr_text = pytesseract.image_to_string(page_image, lang="eng")
                        if ocr_text.strip():
                            page_text = ocr_text
                    except Exception as ocr_err:
                        logger.debug(f"OCR failed for page {page_idx + 1} in {pdf_path}: {ocr_err}")

                if page_text.strip():
                    full_text_pages.append(page_text.strip())

    except Exception as exc:
        logger.error(f"Error opening PDF {pdf_path}: {exc}")
        return ""

    return "\n\n".join(full_text_pages)


def clean_and_chunk_text(text: str, chunk_size: int = 500, overlap: int = 80) -> List[str]:
    """
    Cleans raw PDF text and splits into module-level chunks suitable for embedding.
    """
    # Clean excessive whitespace and carriage returns
    cleaned = re.sub(r"\r\n|\r", "\n", text)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()

    if not cleaned:
        return []

    words = cleaned.split()
    chunks: List[str] = []

    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk_str = " ".join(chunk_words)
        if len(chunk_str.strip()) > 30:
            chunks.append(chunk_str.strip())
        i += (chunk_size - overlap)

    return chunks


def parse_program_metadata(filename: str, full_text: str) -> Dict[str, Any]:
    """
    Extracts structured fields (course name, sector, NVQF level, duration)
    from filename and curriculum header text.
    """
    # Base name without extension
    base = os.path.splitext(os.path.basename(filename))[0].replace("_", " ").replace("-", " ")
    
    # Try finding NVQF Level in text
    nvqf_match = re.search(r"NVQF\s*(?:Level)?\s*[:\-]?\s*([1-6])", full_text, re.IGNORECASE)
    nvqf_level = int(nvqf_match.group(1)) if nvqf_match else 3

    # Try finding duration in months or hours
    dur_match = re.search(r"(\d+)\s*(?:Months|Month|mo)", full_text, re.IGNORECASE)
    duration_months = int(dur_match.group(1)) if dur_match else 6

    # Determine sector
    sector = "Vocational Skills"
    text_lower = full_text.lower()
    if any(k in text_lower for k in ["computer", "cloud", "software", "web", "ai", "cyber", "python"]):
        sector = "Information Technology"
    elif any(k in text_lower for k in ["solar", "photovoltaic", "energy", "electric"]):
        sector = "Renewable Energy & Electrical"
    elif any(k in text_lower for k in ["hospital", "clinical", "health", "patient", "nursing"]):
        sector = "Healthcare"
    elif any(k in text_lower for k in ["design", "graphic", "media", "video"]):
        sector = "Creative Arts & Media"

    return {
        "name": f"NAVTTC {base.title()}",
        "type": "navttc_course",
        "sector": sector,
        "nvqf_level": nvqf_level,
        "duration_months": duration_months,
        "fee": 0.00,
        "stipend": 3000.00,
        "entry_requirement": "Matric (Science/Arts) or Intermediate",
        "outline_text": full_text[:1200] if full_text else "NAVTTC Certified Competency-Based Training Curriculum."
    }


def main():
    parser = argparse.ArgumentParser(description="Ingest NAVTTC curriculum PDFs into Careerly AI PostgreSQL database.")
    parser.add_argument("--dir", default="data/navttc_pdfs", help="Directory containing NAVTTC curriculum PDFs")
    parser.add_argument("--dry-run", action="store_true", help="Extract and summarize without inserting into database")
    parser.add_argument("--db-url", default=DATABASE_URL, help="PostgreSQL connection string")
    args = parser.parse_args()

    pdf_files = glob.glob(os.path.join(args.dir, "*.pdf"))
    logger.info(f"Starting NAVTTC Ingestion. Found {len(pdf_files)} PDF file(s) in {args.dir}.")

    if not pdf_files:
        logger.info(f"No PDF files found in '{args.dir}'. Place NAVTTC curriculum PDFs here and re-run.")
        print("\n================== SUMMARY REPORT ==================")
        print(f"Directory: {args.dir}")
        print("Total PDF files processed: 0")
        print("Note: To add curricula, drop official NAVTTC PDF documents into data/navttc_pdfs/")
        print("====================================================\n")
        return

    # Load SentenceTransformer model if not in dry-run
    embedder = None
    if not args.dry_run and SentenceTransformer:
        try:
            logger.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
            embedder = SentenceTransformer(EMBEDDING_MODEL_NAME)
        except Exception as e:
            logger.warning(f"Could not initialize SentenceTransformer ({e}). Embedding will be omitted.")

    db_conn = None
    if not args.dry_run and psycopg2:
        try:
            db_conn = psycopg2.connect(args.db_url)
            logger.info("Connected to PostgreSQL successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL ({e}). Operating in dry-run mode.")
            args.dry_run = True

    processed_count = 0
    total_chunks_created = 0
    failed_files: List[str] = []
    low_text_files: List[str] = []

    today_str = datetime.date.today().isoformat()

    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        logger.info(f"Processing: {filename}")
        
        raw_text = extract_text_from_pdf(pdf_path)
        if not raw_text or len(raw_text.strip()) == 0:
            failed_files.append(filename)
            continue

        if len(raw_text.strip()) < 100:
            low_text_files.append(filename)

        chunks = clean_and_chunk_text(raw_text)
        metadata = parse_program_metadata(filename, raw_text)

        logger.info(f"Extracted {len(chunks)} chunks for '{metadata['name']}'.")
        total_chunks_created += len(chunks)
        processed_count += 1

        if not args.dry_run and db_conn:
            try:
                with db_conn.cursor() as cur:
                    # Insert into programs table
                    cur.execute("""
                        INSERT INTO programs (
                            name, type, sector, nvqf_level, duration_months, fee, stipend,
                            entry_requirement, outline_text, source_url, last_verified_date
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                    """, (
                        metadata["name"], metadata["type"], metadata["sector"], metadata["nvqf_level"],
                        metadata["duration_months"], metadata["fee"], metadata["stipend"],
                        metadata["entry_requirement"], metadata["outline_text"],
                        f"file://{filename}", today_str
                    ))
                    program_id = cur.fetchone()[0]

                    # Insert chunks with embeddings
                    if chunks:
                        chunk_rows = []
                        if embedder:
                            embeddings = embedder.encode(chunks, show_progress_bar=False)
                            for chunk_text, emb in zip(chunks, embeddings):
                                chunk_rows.append((program_id, chunk_text, emb.tolist()))
                        else:
                            for chunk_text in chunks:
                                chunk_rows.append((program_id, chunk_text, None))

                        execute_values(
                            cur,
                            "INSERT INTO program_chunks (program_id, chunk_text, embedding) VALUES %s",
                            chunk_rows
                        )

                db_conn.commit()
                logger.info(f"Successfully saved {metadata['name']} (ID: {program_id}) into database.")
            except Exception as ins_err:
                db_conn.rollback()
                logger.error(f"Failed to insert records for {filename}: {ins_err}")
                failed_files.append(filename)

    if db_conn:
        db_conn.close()

    # Print Summary Report
    print("\n================== SUMMARY REPORT ==================")
    print(f"Total PDFs found:        {len(pdf_files)}")
    print(f"Successfully processed:  {processed_count}")
    print(f"Total chunks created:    {total_chunks_created}")
    print(f"Mode:                    {'DRY RUN' if args.dry_run else 'COMMITTED TO DATABASE'}")
    print(f"Verification date:       {today_str}")

    if low_text_files:
        print(f"\nFiles with suspiciously low text (< 100 chars):")
        for f in low_text_files:
            print(f"  - {f} (Verify OCR language or scan quality)")

    if failed_files:
        print(f"\nFailed files:")
        for f in failed_files:
            print(f"  - {f}")
    print("====================================================\n")


if __name__ == "__main__":
    main()
