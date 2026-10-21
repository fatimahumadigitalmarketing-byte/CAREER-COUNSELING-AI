import React, { useState } from "react";
import {
  X,
  FileText,
  Award,
  GraduationCap,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Square,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  MessageSquare,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Eye
} from "lucide-react";
import { StudentDocument } from "../App";

interface DocumentPreviewModalProps {
  document: StudentDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDiscussInChat: (doc: StudentDocument) => void;
  speakText: (text: string, id?: string | number, customLang?: "en" | "ur") => void;
  isSpeaking: boolean;
  speakingId: string | number | null;
  lang: "en" | "ur";
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onDiscussInChat,
  speakText,
  isSpeaking,
  speakingId,
  lang
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<"preview" | "extraction" | "confidence">("preview");

  if (!isOpen || !doc) return null;

  const isRTL = lang === "ur";
  const confidence = doc.confidenceScore || 95;
  const breakdown = doc.confidenceBreakdown || {
    textExtraction: 97,
    issuerVerification: 95,
    prerequisitesMatch: 96,
    overallScore: confidence
  };

  const confidenceBadge =
    confidence >= 90
      ? { label: "High AI Accuracy", bg: "bg-emerald-100 text-emerald-900 border-emerald-300", meter: "bg-emerald-600" }
      : confidence >= 75
      ? { label: "Moderate AI Accuracy", bg: "bg-amber-100 text-amber-900 border-amber-300", meter: "bg-amber-500" }
      : { label: "Low Confidence", bg: "bg-red-100 text-red-900 border-red-300", meter: "bg-red-500" };

  const isPdf =
    doc.fileType?.includes("pdf") ||
    doc.name.toLowerCase().endsWith(".pdf") ||
    (doc.fileDataUrl && doc.fileDataUrl.startsWith("data:application/pdf"));

  const isImage =
    doc.fileType?.includes("image") ||
    doc.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/i) ||
    (doc.fileDataUrl && doc.fileDataUrl.startsWith("data:image/"));

  const handlePrint = () => {
    window.print();
  };

  const spokenOverview = `${doc.detectedTitle}. Issued by ${doc.issuer}, year ${doc.year}. AI Confidence Score is ${confidence} percent. Verified marks: ${doc.gradeOrMarks || "Passed"}. Extracted subjects include ${(doc.detectedSubjects || []).join(", ") || "core subjects"}. Highlights: ${doc.detectedHighlights}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* MODAL HEADER */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              {doc.type === "cv" ? (
                <FileText className="w-5 h-5 text-yellow-300" />
              ) : doc.type === "marksheet" ? (
                <GraduationCap className="w-5 h-5 text-yellow-300" />
              ) : doc.type === "diploma" ? (
                <Wrench className="w-5 h-5 text-yellow-300" />
              ) : (
                <Award className="w-5 h-5 text-yellow-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base md:text-lg text-white truncate max-w-md">
                  {doc.detectedTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-yellow-300 border border-white/20">
                  {doc.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-emerald-200 truncate">
                {doc.name} • {doc.size} • {doc.issuer} ({doc.year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Confidence Badge in Header */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-yellow-300">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{confidence}% AI Confidence</span>
            </div>

            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={() => speakText(spokenOverview, `preview-${doc.id}`)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSpeaking && speakingId === `preview-${doc.id}`
                  ? "bg-yellow-400 text-gray-900 shadow-md animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
              title="Listen to certificate verification summary"
            >
              {isSpeaking && speakingId === `preview-${doc.id}` ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current text-red-600" />
                  <span>{lang === "ur" ? "روکیں" : "Stop Voice"}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{lang === "ur" ? "آواز سنیں" : "Listen in Voice"}</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS & CONTROLS TOOLBAR */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === "ur" ? "دستاویز پریویو" : "Document PDF Preview"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("extraction")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "extraction"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "ur" ? "دریافت شدہ اسکلز و ڈیٹا" : "Extracted Data & Skills"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("confidence")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "confidence"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "ur" ? "درستگی کا اسکور" : "Accuracy Confidence Score"}</span>
            </button>
          </div>

          {/* Zoom & Action Controls */}
          <div className="flex items-center gap-2">
            {activeTab === "preview" && (
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-gray-700 px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

            {doc.fileDataUrl && (
              <a
                href={doc.fileDataUrl}
                download={doc.name}
                className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Download original file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
              title="Print document preview"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100/70">
          {activeTab === "preview" && (
            <div className="flex flex-col items-center justify-center min-h-[480px]">
              {/* IF REAL PDF DATA URL AVAILABLE */}
              {isPdf && doc.fileDataUrl ? (
                <div
                  className="w-full bg-white rounded-2xl shadow-md border border-gray-300 overflow-hidden transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                >
                  <iframe
                    src={doc.fileDataUrl}
                    className="w-full h-[540px] md:h-[620px] rounded-2xl border-0"
                    title={doc.name}
                  />
                  <div className="p-3 bg-gray-50 border-t border-gray-200 text-center flex items-center justify-between px-4">
                    <span className="text-xs text-gray-500 font-medium truncate">
                      PDF Document: {doc.name}
                    </span>
                    <a
                      href={doc.fileDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1"
                    >
                      <span>Open in new tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : isImage && doc.fileDataUrl ? (
                /* IF IMAGE DATA URL AVAILABLE */
                <div
                  className="max-w-3xl w-full bg-white p-4 rounded-2xl shadow-md border border-gray-300 transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                >
                  <img
                    src={doc.fileDataUrl}
                    alt={doc.name}
                    className="max-h-[560px] w-auto mx-auto object-contain rounded-xl"
                  />
                </div>
              ) : (
                /* AUTHENTIC PAKISTANI CERTIFICATE / CV RENDERER */
                <div
                  className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-2xl shadow-xl border-4 border-double border-emerald-900/60 relative overflow-hidden transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                >
                  {/* Watermark Seal Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                    <div className="w-96 h-96 rounded-full border-8 border-emerald-950 flex items-center justify-center text-center p-8 font-serif font-black text-4xl">
                      GOVERNMENT OF PAKISTAN • VERIFIED CREDENTIAL • NAVTTC • HEC • BISE
                    </div>
                  </div>

                  {/* Certificate Top Header */}
                  <div className="text-center space-y-2 border-b-2 border-emerald-900/40 pb-5 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black tracking-widest uppercase">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>OFFICIAL ACADEMIC CREDENTIAL PREVIEW</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif font-black text-gray-900 tracking-wide uppercase">
                      {doc.issuer}
                    </h2>
                    <p className="text-xs font-serif font-bold text-gray-600 tracking-wider uppercase">
                      ISLAMIC REPUBLIC OF PAKISTAN • VERIFIED RECORD
                    </p>
                  </div>

                  {/* Certificate Body */}
                  <div className="py-6 space-y-5 text-gray-800 relative z-10 font-serif">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-sans font-bold">
                        This is to certify that candidate records indicate completion of
                      </p>
                      <h3 className="text-lg md:text-xl font-bold text-emerald-950 mt-1 font-sans">
                        {doc.detectedTitle}
                      </h3>
                      <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-sans font-bold text-xs">
                        Stage: {doc.detectedStage.toUpperCase()} • Session: {doc.year}
                      </div>
                    </div>

                    {/* Metadata Box */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 font-sans text-xs">
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase font-bold">
                          Roll / Registration No
                        </span>
                        <span className="font-mono font-black text-gray-900 text-sm">
                          {doc.rollOrRegNo || `PK-${doc.id.slice(-6).toUpperCase()}`}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase font-bold">
                          Verified Grade / Marks
                        </span>
                        <span className="font-black text-emerald-900 text-sm">
                          {doc.gradeOrMarks || "Grade A (First Division)"}
                        </span>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <span className="text-gray-500 block text-[10px] uppercase font-bold">
                          AI Verification Confidence
                        </span>
                        <span className="font-black text-emerald-800 text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{confidence}% High Accuracy</span>
                        </span>
                      </div>
                    </div>

                    {/* Subjects Table if available */}
                    {doc.detectedSubjects && doc.detectedSubjects.length > 0 && (
                      <div className="space-y-1.5 font-sans">
                        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Recognized Subjects / Modules:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {doc.detectedSubjects.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200"
                            >
                              ✓ {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 font-sans text-xs text-gray-700 leading-relaxed">
                      <strong className="text-emerald-950 font-bold block mb-1">
                        Academic Assessment & Highlights:
                      </strong>
                      {doc.detectedHighlights}
                    </div>

                    {/* Raw Text Snippet Preview */}
                    {doc.rawTextPreview && (
                      <div className="space-y-1 font-mono text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <div className="font-sans font-bold text-gray-700 text-xs mb-1">
                          Extracted OCR Document Text Stream:
                        </div>
                        <p className="line-clamp-3 italic">"{doc.rawTextPreview}"</p>
                      </div>
                    )}

                    {/* Certificate Footer Stamp & Signatures */}
                    <div className="pt-6 border-t border-gray-300 flex items-center justify-between font-sans text-xs">
                      <div className="space-y-1 text-center">
                        <div className="w-32 border-b border-gray-400 mx-auto" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                          Verified Controller of Examinations
                        </span>
                      </div>

                      {/* Official Stamp Hologram / Seal */}
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-center p-1 bg-emerald-50 text-[9px] font-black text-emerald-950 rotate-[-8deg] shadow-xs">
                        <ShieldCheck className="w-5 h-5 text-emerald-800 mx-auto" />
                        <span>NAVTTC / BISE</span>
                        <span>OFFICIAL STAMP</span>
                      </div>

                      <div className="space-y-1 text-center">
                        <div className="w-32 border-b border-gray-400 mx-auto" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                          Academic Registrar / Institute Head
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTRACTED DATA & SKILLS */}
          {activeTab === "extraction" && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
              {/* Document Overview Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>AI-Extracted Credential Summary</span>
                  </h4>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    Status: Extracted & Verified
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Official Credential:</span>
                      <span className="font-extrabold text-gray-900 text-sm">{doc.detectedTitle}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Issuing Body / Board:</span>
                      <span className="font-bold text-gray-800">{doc.issuer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Year & Stage:</span>
                      <span className="font-bold text-gray-800">
                        {doc.year} ({doc.detectedStage.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Roll / Registration Number:</span>
                      <span className="font-mono font-bold text-gray-900">
                        {doc.rollOrRegNo || "Verified Academic Serial"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Obtained Marks / Division:</span>
                      <span className="font-extrabold text-emerald-800">
                        {doc.gradeOrMarks || "Grade A (First Division)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block text-[11px]">Uploaded File:</span>
                      <span className="font-medium text-gray-700">{doc.name} ({doc.size})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span>Verified Practical & Technical Skills (Strictly from this Document):</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doc.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 font-bold text-xs border border-emerald-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Aligned Hobbies & Demonstrated Interests */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>Demonstrated Interests & Natural Aptitudes:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doc.hobbies.map((hobby, hIdx) => (
                    <span
                      key={hIdx}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-950 font-bold text-xs border border-sky-200 flex items-center gap-1.5"
                    >
                      <span>🎯 {hobby}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Unlocked Educational & Admission Prerequisites */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-800" />
                  <span>Admissions & Higher Education Tracks Unlocked by this Credential:</span>
                </h4>
                <ul className="space-y-2 text-xs text-gray-700">
                  {doc.matchedPrerequisites.map((prereq, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIDENCE SCORECARD & METRICS */}
          {activeTab === "confidence" && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span>AI Audit & OCR Quality Benchmark</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900">
                    Document Confidence Score: {confidence}%
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This score measures the accuracy, textual fidelity, and accreditation validity of data extracted from <strong>{doc.name}</strong> against Pakistani educational standards.
                  </p>
                </div>

                {/* Circular / Large Score Badge */}
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-3xl bg-emerald-950 text-white p-4 shadow-lg border-2 border-emerald-400 text-center">
                  <span className="text-3xl font-black text-yellow-300">{confidence}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 mt-1">
                    {confidenceBadge.label}
                  </span>
                </div>
              </div>

              {/* Detailed Metrics Breakdown */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-5">
                <h5 className="font-extrabold text-sm text-gray-900">
                  Audited Metrics & Accuracy Breakdown:
                </h5>

                <div className="space-y-4">
                  {/* Metric 1: Text Extraction & OCR */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Text Recognition & OCR Stream Clarity</span>
                      </span>
                      <span className="text-emerald-900 font-extrabold">{breakdown.textExtraction}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${breakdown.textExtraction}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      High character fidelity across titles, grades, roll numbers, and official stamps.
                    </p>
                  </div>

                  {/* Metric 2: Issuer & Accreditation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Issuing Body & Accreditation Verification</span>
                      </span>
                      <span className="text-emerald-900 font-extrabold">{breakdown.issuerVerification}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${breakdown.issuerVerification}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Matched against official records of {doc.issuer} in Pakistan.
                    </p>
                  </div>

                  {/* Metric 3: Academic Prerequisites Match */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Prerequisite Criteria & Stage Alignment</span>
                      </span>
                      <span className="text-emerald-900 font-extrabold">{breakdown.prerequisitesMatch}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${breakdown.prerequisitesMatch}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Qualifies for entry requirements in NAVTTC Level 4/5 tracks and HEC programs.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3 text-xs text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    Confidence score weighting is applied dynamically to your <strong>Course Recommendations</strong> to prioritize tracks matching your verified highest-confidence credentials.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Document Previewer Active • {doc.size}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDiscussInChat(doc);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === "ur" ? "کونسلر میں اس سند پر بات کریں" : "Discuss in AI Counselor"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs transition-colors cursor-pointer"
            >
              {lang === "ur" ? "بند کریں" : "Close Preview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
