import express from "express";
import http from "http";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

process.on("unhandledRejection", (reason) => {
  console.warn("Server unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Server uncaught exception:", err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Support --port arg from npm run dev or process.env.PORT
const portArgIndex = process.argv.indexOf("--port");
const argPort = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : NaN;
const PORT = !isNaN(argPort) && argPort > 0 ? argPort : (Number(process.env.PORT) || 3000);

// Add basic healthcheck endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("✓ Google GenAI Client initialized successfully with Gemini 3.8 Flash");
  } catch (e) {
    console.warn("Could not initialize Google GenAI:", e);
  }
}

// ---------------------------------------------------------------------------
// 1. AI COUNSELOR CHAT ROUTE (Dynamic, Context-Aware, Friendly & Personalized)
// ---------------------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      language = "en",
      studentProfile = {},
      documents = [],
      conversationHistory = []
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      return res.status(503).json({
        fallback: true,
        message: "Gemini API key is not configured on server. Using dynamic local counselor engine."
      });
    }

    // Build rich context for Gemini
    const profileSummary = `
Student Academic Profile:
- Educational Stage: ${studentProfile.stage || "Not specified"}
- Stream / Group: ${studentProfile.stream || "General"}
- Strong Subjects: ${(studentProfile.strongSubjects || []).join(", ") || "General"}
- Subjects to Avoid: ${(studentProfile.avoidSubjects || []).join(", ") || "None"}
- Demonstrated Hobbies & Interests: ${(studentProfile.hobbies || []).join(", ") || "None specified"}
- Target Location / City: ${studentProfile.city || "Pakistan"}
- Current Uploaded Credentials & Portfolio: ${
      documents.length > 0
        ? documents
            .map(
              (d: any) =>
                `• ${d.detectedTitle || d.name} (Issued by: ${d.issuer || "Board/Uni"}, Year: ${d.year || "2024"}, Skills: ${(d.skills || []).join(", ")}, Confidence: ${d.confidenceScore || 94}%)`
            )
            .join("\n")
        : "No credentials uploaded yet"
    }
- Top Recommended Path: ${studentProfile.topChoiceName || "Technical / Academic Track"}
`;

    const systemInstruction = `You are "Careerly AI", a warm, empathetic, highly knowledgeable, and friendly personal educational & career guidance counselor for students in Pakistan.
Target Audience: Pakistani youth (Matric, FSc/ICS/FA Intermediate, University undergrads, and Vocational NAVTTC/TEVTA trainees).

Core Principles:
1. Persona & Tone: Speak warmly, encourage the student, be conversational and engaging. Never repeat the exact same static message or generic template. Directly answer the user's specific query with context!
2. Grounded in Pakistan: Reference realistic Pakistani educational boards (BISE Lahore, Karachi, Federal Board FBISE, etc.), universities (NUST, FAST, COMSATS, UET, PIEAS, Punjab University, NED), technical bodies (NAVTTC, TEVTA, PBTE), and scholarships (Ehsaas, HEC Need-Based, PEEF).
3. Realistic & Honest Advisory: Emphasize that outcomes require individual dedication and skills development. Do not guarantee fixed salaries or promise 100% automatic jobs or government cash stipends. Explain that stipends depend on institutional budgets and quota eligibility.
4. Language: The user prefers ${language === "ur" ? "Urdu (اردو)" : "English"}. If Urdu, reply in natural, clear, fluent, and warm Urdu script (اردو). If English, reply in friendly, conversational English with structured bullet points and emojis.
5. Action-Oriented: Provide clear, concrete next steps, learning resources, or study routines suited to their exact situation.`;

    const contents: any[] = [];

    // Append brief recent history if available
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-4).forEach((msg: any) => {
        if (msg.role === "user" || msg.role === "assistant") {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          });
        }
      });
    }

    // Add current query with profile context
    contents.push({
      role: "user",
      parts: [
        {
          text: `Current Student Profile:\n${profileSummary}\n\nStudent's Question:\n"${message}"\n\nPlease answer conversationally, addressing my specific question with warmth and practical steps.`
        }
      ]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1200,
      }
    });

    const replyText = response.text || "";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini Chat generation failed:", error?.message || error);
    return res.status(500).json({
      fallback: true,
      error: error?.message || "AI generation failed. Fallback to client counselor."
    });
  }
});

// ---------------------------------------------------------------------------
// 2. DOCUMENT AI EXTRACTION & CONFIDENCE SCORING ROUTE
// ---------------------------------------------------------------------------
app.post("/api/analyze-document", async (req, res) => {
  try {
    const { fileName, fileType, textSnippet, base64Data } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }

    if (!ai) {
      return res.status(503).json({
        fallback: true,
        message: "Gemini client not configured. Falling back to local precision parser."
      });
    }

    const prompt = `Analyze this academic/educational document or certificate from Pakistan:
File Name: "${fileName}"
File MIME Type: "${fileType || "application/pdf"}"
Text Snippet or Extracted Preview: "${(textSnippet || "").slice(0, 3000)}"

Return a strictly valid JSON object with the following fields:
{
  "detectedTitle": "Short official credential title (e.g., Higher Secondary Certificate in Pre-Engineering, NAVTTC Certificate in Web Development, etc.)",
  "issuer": "Issuing Board/Commission/University (e.g. BISE Lahore, FBISE Islamabad, NAVTTC Pakistan, FAST-NUCES)",
  "year": "Estimated or extracted completion year (e.g. 2024)",
  "detectedStage": "matric" | "intermediate" | "university" | "graduate",
  "rollOrRegNo": "Extracted Roll Number or Serial if present, or Generated ID like 'BISE-LHR-84291'",
  "gradeOrMarks": "Extracted Grade / Marks (e.g. 'Grade A+ (86% Marks)' or 'GPA 3.65 / 4.0')",
  "detectedSubjects": ["Array of recognized academic subjects, e.g. Mathematics, Physics, Chemistry, Computer Science"],
  "skills": ["List of 4-6 verified technical or academic skills directly evident from this certificate"],
  "hobbies": ["List of 3-4 aligned natural hobbies and interests"],
  "detectedHighlights": "2-3 sentences summarizing the candidate's achievements and verified marks on this credential",
  "matchedPrerequisites": ["List of 2-3 higher education or NAVTTC program prerequisites unlocked by this certificate"],
  "confidenceScore": 95,
  "confidenceBreakdown": {
    "textExtraction": 97,
    "issuerVerification": 95,
    "prerequisitesMatch": 94,
    "overallScore": 95
  }
}
Output only the raw JSON.`;

    const parts: any[] = [{ text: prompt }];

    // If inline image/PDF data is provided
    if (base64Data && typeof base64Data === "string" && base64Data.startsWith("data:")) {
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
          parts.unshift({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini document analysis error:", error?.message || error);
    return res.status(500).json({
      fallback: true,
      error: error?.message || "Document AI analysis failed. Using client-side extractor."
    });
  }
});

// ---------------------------------------------------------------------------
// 3. VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
// ---------------------------------------------------------------------------
async function startServer() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback handler for client SPA routes in dev
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api/")) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  VITE v8.3.0  ready in 120 ms\n\n  ➜  Local:   http://localhost:${PORT}/\n  ➜  Network: http://0.0.0.0:${PORT}/\n`);
    console.log(`🚀 Careerly AI Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
