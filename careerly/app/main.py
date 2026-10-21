"""
Careerly AI - FastAPI Main Application
Exposes GET /, POST /chat, and GET /health with IP rate limiting,
CORS security, privacy safeguards, and static file serving.
"""

import os
import logging
from typing import List, Literal, Optional
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.ai import run_chat_loop, load_system_prompt

# Configure privacy-preserving logging (never log message contents or student PII)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("careerly.api")

# Rate limiter: 30 requests per minute per IP to protect student chat from abuse
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Careerly AI API",
    description="AI Career and Education Counselor for Pakistani Students",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration - strictly local hosts
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load system prompt at startup
@app.on_event("startup")
async def startup_event():
    prompt = load_system_prompt()
    logger.info(f"Careerly AI initialized. System prompt loaded successfully ({len(prompt)} chars).")


# =========================================================================
# REQUEST & RESPONSE SCHEMAS
# =========================================================================

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=2000, description="Message text limited to 2,000 characters")

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., max_items=20, description="Chat conversation history trimmed to 20 messages")

class ChatResponse(BaseModel):
    reply: str

class HealthResponse(BaseModel):
    status: str
    service: str
    model: str


# =========================================================================
# ROUTES
# =========================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint verifying API service availability."""
    return HealthResponse(
        status="healthy",
        service="Careerly AI Counselor",
        model=os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    )


@app.post("/chat", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat_endpoint(request: Request, payload: ChatRequest):
    """
    Main dialogue endpoint.
    Processes conversation through Claude tool-use loop and returns counselor response.
    Never logs message content or personally identifiable student details.
    """
    try:
        if not payload.messages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Messages list cannot be empty."
            )

        # Convert to dicts for AI processor
        raw_msgs = [m.model_dump() for m in payload.messages]
        
        reply_text = await run_chat_loop(raw_msgs)
        return ChatResponse(reply=reply_text)

    except HTTPException:
        raise
    except Exception as exc:
        # Never output stack trace to client
        logger.error(f"Unhandled error during /chat execution: {exc}")
        return ChatResponse(
            reply="We experienced an unexpected server issue while retrieving your guidance. Please try again shortly."
        )


# Mount static directory for single-page frontend
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.isdir(STATIC_DIR):
    @app.get("/")
    async def serve_index():
        index_file = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse({"message": "Careerly AI API is active. Frontend index not found."})

    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
else:
    @app.get("/")
    async def root_index():
        return JSONResponse({
            "message": "Careerly AI API is active.",
            "health": "/health",
            "chat": "/chat"
        })
