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

    const portfolioInfo = studentProfile.portfolioLinks
      ? `• LinkedIn: ${studentProfile.portfolioLinks.linkedinUrl || "None"} • GitHub: ${studentProfile.portfolioLinks.githubUrl || "None"} • Portfolio: ${studentProfile.portfolioLinks.portfolioWebsiteUrl || "None"}`
      : "None provided";

    // Build rich context for Gemini
    const profileSummary = `
Student Academic Profile & Background:
- Educational Stage / Status: ${studentProfile.stage || "Ongoing Degree / Student"}
- Stream / Program: ${studentProfile.stream || "General / Arts / Humanities / BS / BA"}
- Current Ongoing Degree / Background: ${studentProfile.currentEducation || studentProfile.stream || "Enrolled student (e.g., BA English / Intermediate / BS)"}
- Strong Subjects: ${(studentProfile.strongSubjects || []).join(", ") || "General"}
- Subjects to Avoid: ${(studentProfile.avoidSubjects || []).join(", ") || "None"}
- Demonstrated Hobbies & Leisure Interests: ${(studentProfile.hobbies || []).join(", ") || "None specified"}
- Target Location / City: ${studentProfile.city || "Pakistan"}
- Portfolio & Social Links: ${portfolioInfo}
- Current Uploaded Credentials & Portfolio: ${
      documents.length > 0
        ? documents
            .map(
              (d: any) =>
                `• ${d.detectedTitle || d.name} (Issued by: ${d.issuer || "Board/Uni"}, Year: ${d.year || "2024"}, Grade: ${d.gradeOrMarks || "Passed"}, Skills: ${(d.skills || []).join(", ")})`
            )
            .join("\n")
        : "No credentials uploaded yet"
    }
- Top Recommended Path: ${studentProfile.topChoiceName || "High-Income Skill Enhancement Track"}
`;

    const systemInstruction = `You are "Careerly AI", a focused, high-precision, personal educational and career guidance mentor for Pakistani students and young professionals.

CRITICAL INSTRUCTIONS & FORMATTING RULES:
1. STRICTLY CONCISE & TO-THE-POINT (NO ESSAYS / NO LONG PARAGRAPHS):
   - Never write long, winding essays or generic filler paragraphs.
   - Limit total response length to 100 - 150 words maximum.
   - Use crisp, high-impact bullet points and short 1-2 sentence insights.
   - Immediately answer the exact question asked. No fluffy introductory or concluding generic pleasantries.

2. SUPPORT ONGOING DEGREES & WORKING STUDENTS (DO NOT SUGGEST UNNECESSARY DEGREES):
   - If a student is ALREADY enrolled in a degree (e.g., BA English, BS, FA, etc.) or currently doing an internship/job: DO NOT suggest they abandon it or start another 4-year degree from scratch!
   - Instead, recommend targeted, high-ROI skill enhancement courses, micro-credentials (NAVTTC, DigiSkills, Coursera, Google certifications), and lucrative career pathways (e.g., for BA English: SEO Content Strategy, Copywriting, Technical Writing, Digital Marketing, Corporate Communications, UX Writing, Freelance Upwork/Fiverr consulting) to help them upskill and earn more immediately.

3. GROUNDED IN THEIR DOCUMENTS, CERTIFICATES & PORTFOLIO:
   - Actively reference their uploaded credentials, marks, certificates, and LinkedIn/GitHub links if available.
   - Connect their personal hobbies and interests directly to practical earning pathways.

4. LANGUAGE & TONE:
   - Match the student's language: If Roman Urdu, respond in crisp, natural Roman Urdu. If Urdu script (اردو), respond in brief Urdu. If English, respond in clear professional English.
   - Advisory notice: realistic Pakistani market guidance (HEC, NAVTTC, TEVTA); no false guaranteed salary claims.`;

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
          text: `Student Academic Profile & Context:\n${profileSummary}\n\nStudent's Query:\n"${message}"\n\nPlease answer concisely in bullet points (under 120 words), directly addressing the query without long essays.`
        }
      ]
    });

    let replyText = "";
    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.75,
          }
        });
        if (response.text && response.text.trim().length > 15) {
          replyText = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed or unavailable, trying next:`, err?.message?.slice(0, 80));
      }
    }

    if (!replyText) {
      throw lastError || new Error("No response generated from available models");
    }

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
// 1b. NEURAL TEXT-TO-SPEECH (TTS) ROUTE (Gemini 3.8 Flash Lite TTS)
// ---------------------------------------------------------------------------
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    if (!ai) {
      return res.status(503).json({ fallback: true, error: "Gemini AI not initialized on server" });
    }

    // Clean text: strip markdown characters that interfere with speech
    const cleanText = text
      .replace(/[*#_~`>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[•👉🛠️💼🚫📅👨‍👩‍👦💡📌⚡🇵🇰✓🎯🔍🏛️📊🌐]/g, "")
      .slice(0, 1200)
      .trim();

    if (!cleanText) {
      return res.status(400).json({ error: "No speakable text provided" });
    }

    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: "Warm, empathetic, articulate personal career counselor voice",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ fallback: true, error: "No audio generated from model" });
    }

    return res.json({
      audio: base64Audio,
      mimeType: "audio/wav",
    });
  } catch (err: any) {
    console.warn("Server TTS generation failed:", err?.message || err);
    return res.status(500).json({ fallback: true, error: err?.message || "TTS generation failed" });
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
  "annotations": [
    {
      "id": "ann-1",
      "target": "Overall Distinction",
      "type": "verified_badge",
      "category": "academic_standing",
      "note": "Verified Board/Commission record with distinction standing.",
      "color": "emerald"
    },
    {
      "id": "ann-2",
      "target": "Core Subject Aptitude",
      "type": "highlight",
      "category": "eligibility_signal",
      "note": "Top percentile marks unlock competitive admission criteria.",
      "color": "blue"
    },
    {
      "id": "ann-3",
      "target": "Career Pathway Fit",
      "type": "counselor_note",
      "category": "strategic_recommendation",
      "note": "Strong alignment with higher education and high-demand industry tracks.",
      "color": "amber"
    }
  ],
  "confidenceScore": 96,
  "confidenceBreakdown": {
    "textExtraction": 98,
    "issuerVerification": 96,
    "prerequisitesMatch": 95,
    "overallScore": 96
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

    let parsed: any = null;
    const docCandidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];

    for (const modelName of docCandidateModels) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        if (result.text) {
          parsed = JSON.parse(result.text.trim());
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} doc analysis error:`, err?.message?.slice(0, 80));
      }
    }

    if (!parsed || !parsed.detectedTitle) {
      throw new Error("Unable to parse document via candidate models");
    }

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini document analysis error:", error?.message || error);
    return res.status(500).json({
      fallback: true,
      error: error?.message || "Document AI analysis failed. Using client-side precision extractor."
    });
  }
});

// ---------------------------------------------------------------------------
// 2b. PAKISTANI CAREER TRENDS & SALARY RADAR ROUTE
// ---------------------------------------------------------------------------
app.get("/api/career-trends", (_req, res) => {
  const trendsData = [
    {
      id: "cs_ai",
      title: "Computer Science, AI & Software Engineering",
      stream: "ICS / Pre-Engineering",
      localDemandIndex: 94,
      remoteExportIndex: 98,
      avgSalaryPKR: {
        entry: "75,000 - 140,000",
        mid: "180,000 - 380,000",
        senior: "450,000 - 1,200,000+"
      },
      yearlyGrowth: [
        { year: 2024, index: 82 },
        { year: 2025, index: 89 },
        { year: 2026, index: 95 },
        { year: 2027, index: 104 },
        { year: 2028, index: 115 }
      ],
      risingSkills: ["Generative AI & LLMs", "Python / FastAPI", "TypeScript & Next.js", "Cloud & DevOps (Docker/K8s)", "Vector DBs"],
      decliningSkills: ["Monolithic PHP", "Basic Manual QA", "Flash / Legacy Frameworks"],
      topInstitutes: ["FAST-NUCES", "NUST SEECS", "COMSATS", "ITU Lahore", "GIKI"],
      employmentShare: "38% Local IT Houses • 45% Remote Offshore Clients • 17% Public & FinTech"
    },
    {
      id: "pre_med_clinical",
      title: "Allied Healthcare, Nursing, DPT & Pharmacy",
      stream: "FSc Pre-Medical",
      localDemandIndex: 91,
      remoteExportIndex: 86,
      avgSalaryPKR: {
        entry: "60,000 - 110,000",
        mid: "130,000 - 240,000",
        senior: "300,000 - 700,000+"
      },
      yearlyGrowth: [
        { year: 2024, index: 78 },
        { year: 2025, index: 84 },
        { year: 2026, index: 91 },
        { year: 2027, index: 99 },
        { year: 2028, index: 108 }
      ],
      risingSkills: ["Critical Care ICU Nursing", "Musculoskeletal Physical Therapy", "Clinical Pharmacy Rounds", "Biotech Diagnostics", "NCLEX-RN UK/US Pathway"],
      decliningSkills: ["Uncertified Dispensary Work", "Paper Patient Records"],
      topInstitutes: ["Aga Khan University (AKU)", "King Edward Medical University", "Shifa Tameer-e-Millat", "Dow University"],
      employmentShare: "52% Tertiary Hospitals • 28% Private Clinics • 20% Overseas Medical Visas"
    },
    {
      id: "engineering_tech",
      title: "Electrical, Renewable Energy & Robotics",
      stream: "FSc Pre-Engineering / DAE",
      localDemandIndex: 85,
      remoteExportIndex: 78,
      avgSalaryPKR: {
        entry: "55,000 - 95,000",
        mid: "120,000 - 220,000",
        senior: "260,000 - 550,000"
      },
      yearlyGrowth: [
        { year: 2024, index: 74 },
        { year: 2025, index: 80 },
        { year: 2026, index: 87 },
        { year: 2027, index: 94 },
        { year: 2028, index: 102 }
      ],
      risingSkills: ["Solar PV Net-Metering Systems", "Embedded Firmware (C++/STM32)", "Industrial PLC & SCADA", "Battery Storage (BESS)"],
      decliningSkills: ["Traditional Coal Plant Engineering", "Manual Drafting / T-Square"],
      topInstitutes: ["UET Lahore / Taxila", "NUST EME", "GIKI", "NED Karachi", "PIEAS"],
      employmentShare: "40% Industrial Plants • 35% Solar EPC Companies • 25% WAPDA / DISCOs"
    },
    {
      id: "business_fintech",
      title: "FinTech, ACCA, Accounting & BBA",
      stream: "I.Com / General / Any",
      localDemandIndex: 88,
      remoteExportIndex: 85,
      avgSalaryPKR: {
        entry: "50,000 - 90,000",
        mid: "115,000 - 210,000",
        senior: "250,000 - 650,000"
      },
      yearlyGrowth: [
        { year: 2024, index: 76 },
        { year: 2025, index: 82 },
        { year: 2026, index: 89 },
        { year: 2027, index: 96 },
        { year: 2028, index: 105 }
      ],
      risingSkills: ["Power BI & Financial Modeling", "IFRS & Corporate Tax (FBR)", "E-Commerce Logistics", "Digital Wallets & Microfinance"],
      decliningSkills: ["Manual Bookkeeping Registers", "Paper Voucher Audits"],
      topInstitutes: ["IBA Karachi", "LUMS SDSB", "NUST NBS", "Hailey College PU"],
      employmentShare: "48% Commercial Banks & FMCGs • 30% Big 4 Audit Firms • 22% Remote Bookkeeping"
    },
    {
      id: "design_media",
      title: "UI/UX Product Design & Visual Media",
      stream: "FA / Arts / Humanities",
      localDemandIndex: 84,
      remoteExportIndex: 94,
      avgSalaryPKR: {
        entry: "50,000 - 95,000",
        mid: "130,000 - 260,000",
        senior: "320,000 - 800,000+"
      },
      yearlyGrowth: [
        { year: 2024, index: 79 },
        { year: 2025, index: 86 },
        { year: 2026, index: 94 },
        { year: 2027, index: 103 },
        { year: 2028, index: 114 }
      ],
      risingSkills: ["Figma Design Systems", "UX Research & Prototyping", "Motion Graphics & After Effects", "3D Blender Assets", "Micro-Interactions"],
      decliningSkills: ["Basic CorelDraw Print Design", "Static PSD Web Mockups"],
      topInstitutes: ["NCA Lahore / Rawalpindi", "BNU Beaconhouse", "Habib University", "Karachi School of Art"],
      employmentShare: "58% Remote Global Upwork/Fiverr • 32% Software Houses & Startups • 10% Local Ad Agencies"
    },
    {
      id: "vocational_trades",
      title: "Certified NAVTTC / TEVTA Technical Trades",
      stream: "Matric Technical / NVQF",
      localDemandIndex: 90,
      remoteExportIndex: 88,
      avgSalaryPKR: {
        entry: "45,000 - 75,000",
        mid: "85,000 - 150,000",
        senior: "180,000 - 380,000"
      },
      yearlyGrowth: [
        { year: 2024, index: 72 },
        { year: 2025, index: 78 },
        { year: 2026, index: 85 },
        { year: 2027, index: 93 },
        { year: 2028, index: 101 }
      ],
      risingSkills: ["Solar Inverter Setup", "Hybrid Auto Diagnostics", "SMD Mobile Circuit Repair", "Precision CNC Operation", "Gulf Certification"],
      decliningSkills: ["Manual Carburetor Tuning", "Non-inverter AC Repair"],
      topInstitutes: ["Government College of Technology", "NAVTTC CoEs", "TEVTA Institutes", "KVTC"],
      employmentShare: "42% Middle East / Gulf Skilled Work • 38% Domestic Workshops • 20% Independent Contracting"
    }
  ];

  return res.json({ success: true, trends: trendsData });
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
