import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Award,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Sparkles,
  Volume2,
  Square,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
  BarChart3,
  Globe,
  GraduationCap,
  Percent,
  Check,
  Clock
} from "lucide-react";

export interface CareerTrendSector {
  id: string;
  title: string;
  stream: string;
  localDemandIndex: number;
  remoteExportIndex: number;
  avgSalaryPKR: {
    entry: string;
    mid: string;
    senior: string;
  };
  yearlyGrowth: { year: number; index: number }[];
  risingSkills: string[];
  decliningSkills: string[];
  topInstitutes: string[];
  employmentShare: string;
}

const FALLBACK_TRENDS: CareerTrendSector[] = [
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
    remoteExportIndex: 92,
    avgSalaryPKR: {
      entry: "50,000 - 90,000",
      mid: "120,000 - 230,000",
      senior: "280,000 - 600,000+"
    },
    yearlyGrowth: [
      { year: 2024, index: 72 },
      { year: 2025, index: 79 },
      { year: 2026, index: 88 },
      { year: 2027, index: 98 },
      { year: 2028, index: 110 }
    ],
    risingSkills: ["Figma Design Systems & Variables", "UX Research & Usability Testing", "Motion Graphics & 3D (Blender)", "Micro-Interactions"],
    decliningSkills: ["Print Newspaper Pagination", "Static Banner Ads"],
    topInstitutes: ["National College of Arts (NCA)", "Beaconhouse National University (BNU)", "Karachi School of Art", "PIFD"],
    employmentShare: "32% Local Software Houses • 54% Global Freelance & Remote • 14% Ad Agencies"
  },
  {
    id: "content_communications",
    title: "SEO Content Strategy, Copywriting & Digital PR",
    stream: "BA English / Arts & Humanities / Media",
    localDemandIndex: 91,
    remoteExportIndex: 96,
    avgSalaryPKR: {
      entry: "55,000 - 95,000",
      mid: "130,000 - 260,000",
      senior: "300,000 - 750,000+"
    },
    yearlyGrowth: [
      { year: 2024, index: 76 },
      { year: 2025, index: 84 },
      { year: 2026, index: 93 },
      { year: 2027, index: 105 },
      { year: 2028, index: 118 }
    ],
    risingSkills: [
      "AI-Augmented Content Strategy",
      "B2B SaaS Technical Copywriting",
      "Search Engine Optimization (Semrush / Ahrefs)",
      "UX Microcopy & Information Architecture",
      "Digital PR & Thought Leadership"
    ],
    decliningSkills: [
      "Unoptimized Keyword Stuffing",
      "Generic Spin-Rewriting",
      "Passive Academic Term Papers"
    ],
    topInstitutes: [
      "DigiSkills Freelance Content Masterclass (Ministry of IT)",
      "NAVTTC National Digital Media Center",
      "Punjab University & NUML English Linguistics Departments",
      "HubSpot & Coursera Inbound Writing"
    ],
    employmentShare: "58% Remote Global Export (Upwork/Direct Clients) • 27% Software House Marketing • 15% Corporate PR"
  },
  {
    id: "navttc_vocational",
    title: "High-Tech Technical & Vocational (NAVTTC / TEVTA)",
    stream: "Matric Technical / DAE / Any",
    localDemandIndex: 92,
    remoteExportIndex: 80,
    avgSalaryPKR: {
      entry: "45,000 - 80,000",
      mid: "95,000 - 180,000",
      senior: "200,000 - 450,000"
    },
    yearlyGrowth: [
      { year: 2024, index: 75 },
      { year: 2025, index: 83 },
      { year: 2026, index: 92 },
      { year: 2027, index: 101 },
      { year: 2028, index: 112 }
    ],
    risingSkills: ["SMD Mobile Motherboard Micro-Soldering", "EV Charging Station Installation", "CNC Machine Programming", "HVAC Inverter Troubleshooting"],
    decliningSkills: ["Conventional Carburetor Mechanics", "Non-Inverter Appliances"],
    topInstitutes: ["NAVTTC Centers of Excellence", "Punjab TEVTA GCTs", "Sindh TEVTA", "KP-TEVTA"],
    employmentShare: "55% Self-Employment / Workshops • 25% Industrial Assembly Plants • 20% Gulf Emigration"
  }
];

export interface TimelineMilestone {
  year: number;
  eraTitle: string;
  eraTitleUr: string;
  theme: string;
  themeUr: string;
  marketShift: string;
  marketShiftUr: string;
  entrySalaryRangePKR: string;
  remoteExportPrevalence: string;
  dominantSkills: string[];
  keyUpskillingAction: string;
  keyUpskillingActionUr: string;
  sectorSpotlight: {
    sector: string;
    description: string;
  }[];
}

export const CAREER_TIMELINE: TimelineMilestone[] = [
  {
    year: 2020,
    eraTitle: "Foundation & Traditional On-Premise Era",
    eraTitleUr: "روایتی دفتری و بنیادی تعلیمی دور",
    theme: "Physical office dominance, textbook curricula, limited remote opportunities",
    themeUr: "دفاتر میں حاضری، روایتی ڈگریوں پر انحصار، ریموٹ جابز کی کمی",
    marketShift: "Traditional four-year degree was considered the sole gateway. Freelance platforms had low awareness in mainstream colleges.",
    marketShiftUr: "صرف 4 سالہ ڈگری کو روزگار کی بنیاد سمجھا جاتا تھا۔ فری لانسنگ کا رجحان محدود تھا۔",
    entrySalaryRangePKR: "25,000 - 45,000 PKR",
    remoteExportPrevalence: "12% of tech graduates working remotely",
    dominantSkills: ["Basic C++/Java", "HTML/CSS", "Traditional Print Media", "Manual Accounting (Tally)", "Dispensary Operations"],
    keyUpskillingAction: "Mastering English typing, basic desktop computing, and standard board curricula.",
    keyUpskillingActionUr: "کمپیوٹر ٹائپنگ اور بنیادی دفتری سافٹ ویئر پر عبور حاصل کرنا۔",
    sectorSpotlight: [
      { sector: "IT & Computing", description: "PHP, desktop software, and on-site maintenance." },
      { sector: "Arts & English", description: "Academic tutoring, print newspapers, and basic transcription." },
      { sector: "Healthcare", description: "Hospital clerkships and manual patient records." }
    ]
  },
  {
    year: 2022,
    eraTitle: "The Remote Acceleration & DigiSkills Surge",
    eraTitleUr: "ریموٹ ورک اور ڈیجی اسکلز کا انقلاب",
    theme: "Pandemic-driven digital boom, Upwork/Fiverr expansion, mobile app ubiquity",
    themeUr: "آن لائن فری لانسنگ کا پھیلاؤ، موبائل ایپس اور ریموٹ جابز کا آغاز",
    marketShift: "DigiSkills program by Ministry of IT trained 2M+ youth. Shift from pure paper marks to demonstrable GitHub & Behance portfolios.",
    marketShiftUr: "حکومتی ڈیجی اسکلز پروگرام نے لاکھوں نوجوانوں کو آن لائن روزگار کی تربیت دی۔ پورٹ فولیو کی اہمیت کا اعتراف ہوا۔",
    entrySalaryRangePKR: "45,000 - 75,000 PKR",
    remoteExportPrevalence: "28% of youth workforce exporting digital services",
    dominantSkills: ["MERN Full Stack (React, Node)", "WordPress & Shopify E-Commerce", "SEO Content Writing", "Graphic Design in Canva/Illustrator"],
    keyUpskillingAction: "Transitioning from classroom theory to freelancing profiles and live customer delivery.",
    keyUpskillingActionUr: "کلاس روم تھیوری سے نکل کر اپ ورک اور فائیور پر لائیو پروفائل بنانا۔",
    sectorSpotlight: [
      { sector: "IT & Computing", description: "React, Node.js, and mobile app APIs." },
      { sector: "Arts & English", description: "SEO blog writing, affiliate marketing, and remote virtual assistant tasks." },
      { sector: "Commerce", description: "Daraz & Amazon Virtual Assistant services." }
    ]
  },
  {
    year: 2024,
    eraTitle: "GenAI Integration & NAVTTC High-Tech Subsidies",
    eraTitleUr: "مصنوعی ذہانت اور نیوٹیک ہائی ٹیک دور",
    theme: "LLM integration, high-tech vocational certifications, cloud computing expansion",
    themeUr: "جنریٹو اے آئی، سرکاری ہائی ٹیک نیوٹیک کورسز، اور کلاؤڈ کمپیوٹنگ",
    marketShift: "Federal government standardized NVQF Level 4/5 certifications. Demand shifted to workers who can leverage AI tools rather than do routine manual tasks.",
    marketShiftUr: "قومی پیشہ ورانہ اسناد (NVQF) کی توثیق۔ معمول کے کاموں کی جگہ AI ٹولز کا ماہرانہ استعمال درکار ہوا۔",
    entrySalaryRangePKR: "65,000 - 110,000 PKR",
    remoteExportPrevalence: "42% of tech & creative professionals billing in USD/foreign currency",
    dominantSkills: ["Prompt Engineering & API Integration", "FastAPI / Python", "AI-Assisted SEO Content", "Cloud Infrastructure (AWS/Docker)", "Figma Design Systems"],
    keyUpskillingAction: "Adding AI copilot workflows into existing domain expertise (English, Design, Code).",
    keyUpskillingActionUr: "اپنے موجودہ ہنر (انگریزی، کوڈنگ، ڈیزائن) میں AI کو پائلٹ ٹولز کا استعمال شامل کرنا۔",
    sectorSpotlight: [
      { sector: "IT & Computing", description: "Next.js 14, vector databases, and automated microservices." },
      { sector: "Arts & English", description: "B2B SaaS copywriting, UX microcopy, and technical document architecture." },
      { sector: "Healthcare", description: "NCLEX-RN prep for high-income nurse emigration to UK/US." }
    ]
  },
  {
    year: 2026,
    eraTitle: "Present Real-Time: AI-Augmented Micro-Credentials",
    eraTitleUr: "موجودہ دور (2026): مائیکرو اسناد اور ریموٹ برتری",
    theme: "Micro-credentials beating generic degrees, specialized niche skills, multi-client freelancing",
    themeUr: "4 سالہ عام ڈگری کے مقابلے میں مخصوص ہنر اور ملٹی کلائنٹ فری لانسنگ",
    marketShift: "Companies prioritize candidates who enhance existing degrees (like BA English or BS) with specialized certifications over starting fresh 4-year degrees.",
    marketShiftUr: "کمپنیاں نئی ڈگری شروع کرنے کے بجائے موجودہ تعلیم کے ساتھ فوری ہائی انکم سرٹیفیکیشن کو فوقیت دیتی ہیں۔",
    entrySalaryRangePKR: "85,000 - 150,000 PKR",
    remoteExportPrevalence: "54% export share in Pakistan's software and digital media sectors",
    dominantSkills: ["Agentic AI Orchestration", "SEO Content Architecture & RevOps", "Cross-Platform Flutter & WebAssembly", "Enterprise Solar EPC", "Critical Care Nursing"],
    keyUpskillingAction: "Taking targeted 3-6 month certifications to directly monetize ongoing degrees or internships.",
    keyUpskillingActionUr: "موجودہ ڈگری یا جاب کے ساتھ 3 سے 6 ماہ کے خصوصی کورسز کر کے فوری زیادہ کمانا۔",
    sectorSpotlight: [
      { sector: "IT & Computing", description: "Autonomous AI agents, enterprise cloud migration, and fintech security." },
      { sector: "Arts & English", description: "Revenue-driven copywriting, corporate brand publishing, and UX content design." },
      { sector: "Engineering", description: "Hybrid solar-storage inverter troubleshooting and EV charging grids." }
    ]
  },
  {
    year: 2028,
    eraTitle: "Autonomous Systems & High-Income Export Parity",
    eraTitleUr: "مستقبل (2028): خودکار سسٹمز اور بین الاقوامی مسابقت",
    theme: "Global salary convergence, specialized technical leadership, autonomous infrastructure",
    themeUr: "عالمی معیار کی تنخواہیں، اعلیٰ سطحی تکنیکی قیادت، خودکار ٹیکنالوجیز",
    marketShift: "Routine coding and low-end translation are fully automated. Highest earners are domain translators, systems architects, and clinical healthcare specialists.",
    marketShiftUr: "سادہ کوڈنگ اور عام ترجمہ خودکار ہو چکا ہوگا۔ سب سے زیادہ کمانے والے شعبہ جاتی حکمت کار اور کلینیکل ماہرین ہوں گے۔",
    entrySalaryRangePKR: "120,000 - 240,000 PKR",
    remoteExportPrevalence: "68% of Pakistani digital talent serving distributed global firms directly",
    dominantSkills: ["Neuro-Symbolic AI & Safety", "Strategic Brand Narrative & Executive PR", "Quantum-Safe Cryptography", "Bio-Informatics Diagnostics", "Smart Grid Automation"],
    keyUpskillingAction: "Becoming an end-to-end strategist combining communication, systems logic, and business impact.",
    keyUpskillingActionUr: "رابطے، بزنس اسٹریٹجی اور ٹیکنالوجی کو یکجا کر کے اسٹریٹجک لیڈر بننا۔",
    sectorSpotlight: [
      { sector: "IT & Computing", description: "Agentic AI development, AI security compliance, and decentralized finance." },
      { sector: "Arts & English", description: "Global brand leadership, corporate AI communication policies, and media IP creation." },
      { sector: "Healthcare", description: "Personalized medicine, AI clinical radiology review, and robotic rehab." }
    ]
  }
];


interface CareerTrendsViewProps {
  lang: "en" | "ur";
  onConsultCareer: (sectorTitle: string) => void;
  speakText: (text: string, id?: string | number, customLang?: "en" | "ur") => void;
  isSpeaking: boolean;
  speakingId: string | number | null;
}

export const CareerTrendsView: React.FC<CareerTrendsViewProps> = ({
  lang,
  onConsultCareer,
  speakText,
  isSpeaking,
  speakingId
}) => {
  const [trends, setTrends] = useState<CareerTrendSector[]>(FALLBACK_TRENDS);
  const [selectedSector, setSelectedSector] = useState<CareerTrendSector>(FALLBACK_TRENDS[0]);
  const [streamFilter, setStreamFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"radar" | "timeline">("radar");
  const [selectedMilestoneYear, setSelectedMilestoneYear] = useState<number>(2026);

  const isRTL = lang === "ur";

  // Fetch live career trends from server
  useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/career-trends");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.trends && Array.isArray(data.trends) ? data.trends : null;
          if (list && list.length > 0 && isMounted) {
            setTrends(list);
            setSelectedSector(list[0]);
          }
        }
      } catch (err) {
        console.warn("Using fallback career trends data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchTrends();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrends = trends.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stream.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.risingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (streamFilter === "all") return true;
    if (streamFilter === "medical") return item.id === "pre_med_clinical";
    if (streamFilter === "cs") return item.id === "cs_ai";
    if (streamFilter === "eng") return item.id === "engineering_tech";
    if (streamFilter === "business") return item.id === "business_fintech";
    if (streamFilter === "content") return item.id === "content_communications";
    if (streamFilter === "arts") return item.id === "design_media";
    if (streamFilter === "vocational") return item.id === "navttc_vocational";
    return true;
  });

  const activeMilestone = CAREER_TIMELINE.find((m) => m.year === selectedMilestoneYear) || CAREER_TIMELINE[3];

  const spokenOverview = `${selectedSector.title}. For ${selectedSector.stream} students. Projected entry salary ${selectedSector.avgSalaryPKR.entry} PKR per month, mid level ${selectedSector.avgSalaryPKR.mid} PKR, and senior level ${selectedSector.avgSalaryPKR.senior} PKR. Local demand index is ${selectedSector.localDemandIndex} out of 100, and global remote index is ${selectedSector.remoteExportIndex} out of 100. Key rising skills include ${selectedSector.risingSkills.slice(0, 3).join(", ")}. Top institutions include ${selectedSector.topInstitutes.slice(0, 3).join(", ")}.`;

  const spokenMilestone = `Year ${activeMilestone.year}: ${lang === "ur" ? activeMilestone.eraTitleUr : activeMilestone.eraTitle}. ${lang === "ur" ? activeMilestone.themeUr : activeMilestone.theme}. Entry salary range ${activeMilestone.entrySalaryRangePKR}. Key upskilling action: ${lang === "ur" ? activeMilestone.keyUpskillingActionUr : activeMilestone.keyUpskillingAction}.`;


  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 md:p-8 shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "ur" ? "پاکستان مارکیٹ ڈیمانڈ ریڈار (2024-2028)" : "PAKISTAN CAREER DEMAND RADAR (2024–2028)"}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {lang === "ur"
              ? "پاکستانی جاب مارکیٹ، تنخواہوں کے رجحانات اور ڈیمانڈ انڈیکس"
              : "Pakistan Career Trends, Salary Trajectories & Market Demands"}
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            {lang === "ur"
              ? "مختلف تعلیمی شعبہ جات (میڈیکل، کمپیوٹر، انجینئرنگ، کامرس، آرٹس، اور ٹیکنیکل کورسز) کے لیے پاکستان کی حقیقی مارکیٹ تنخواہیں، بڑھتی ہوئی اسکلز، اور 2028 تک کی شرح نمو کا تجزیہ۔"
              : "Real-world advisory benchmarks across Pakistani universities, remote freelance exports, and industrial hiring. Discover rising skills, salary ranges in PKR, and top accredited institutes."}
          </p>

          {/* Ethical Disclaimer */}
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === "ur"
                ? "یہ اعداد و شمار صرف تعلیمی رہنمائی کے لیے ہیں۔ تنخواہ کی کوئی فکسڈ گارنٹی نہیں ہوتی۔"
                : "Advisory salary ranges represent standard industry benchmarks across Karachi, Lahore, and Islamabad, not contractual guarantees."}
            </span>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* VIEW MODE TOGGLE & INTRO */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "radar"
                ? "bg-emerald-900 text-white shadow-xs"
                : "text-gray-700 hover:text-emerald-950"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{lang === "ur" ? "مارکیٹ ڈیمانڈ و تنخواہ ریڈار" : "Market Demand & Salary Radar"}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("timeline")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "timeline"
                ? "bg-emerald-900 text-white shadow-xs"
                : "text-gray-700 hover:text-emerald-950"
            }`}
          >
            <Clock className="w-4 h-4 text-yellow-300" />
            <span>{lang === "ur" ? "کیریئر ٹرینڈ ٹائم لائن (2020 تا 2028)" : "Career Trend Timeline (2020–2028)"}</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 font-medium px-2">
          {viewMode === "radar"
            ? (lang === "ur" ? "حالیہ پاکستانی جاب مارکیٹ کا جائزہ" : "Real-time industry benchmark view")
            : (lang === "ur" ? "روایتی ڈگریوں سے مائیکرو اسناد اور ریموٹ تک کا ارتقا" : "Evolution from 4-year degrees to micro-credentials")}
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR (Visible in Radar Mode) */}
      {viewMode === "radar" && (
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-3">
          {/* Stream Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setStreamFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "all"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {lang === "ur" ? "تمام شعبے" : "All Fields"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("cs")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "cs"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💻 {lang === "ur" ? "کمپیوٹر و AI" : "CS & AI"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("content")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "content"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✍️ {lang === "ur" ? "SEO کنٹینٹ و انگلش" : "Content & Copywriting (BA English)"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("medical")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "medical"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🩺 {lang === "ur" ? "ہیلتھ کیئر و پری میڈیکل" : "Pre-Medical & Health"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("eng")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "eng"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⚡ {lang === "ur" ? "انجینئرنگ و سولر" : "Engineering & Solar"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("business")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "business"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📊 {lang === "ur" ? "کامرس و فن ٹیک" : "FinTech & BBA"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("arts")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "arts"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🎨 {lang === "ur" ? "UI/UX و میڈیا" : "UI/UX & Media"}
            </button>
            <button
              type="button"
              onClick={() => setStreamFilter("vocational")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                streamFilter === "vocational"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🛠️ {lang === "ur" ? "ٹیکنیکل و NAVTTC" : "NAVTTC / Technical"}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ur" ? "شعبہ یا اسکل تلاش کریں..." : "Search field or skill..."}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      )}

      {/* RADAR VIEW: TWO-COLUMN LAYOUT */}
      {viewMode === "radar" && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: LIST OF SECTORS */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
              <span>{lang === "ur" ? "دستیاب کیریئر شعبے" : "Career Sectors"} ({filteredTrends.length})</span>
              <span>{lang === "ur" ? "تفصیل دیکھنے کے لیے کلک کریں" : "Select to inspect"}</span>
            </div>

            <div className="space-y-2.5">
              {filteredTrends.map((sector) => {
                const isSelected = selectedSector.id === sector.id;
                return (
                  <div
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-600 shadow-md ring-1 ring-emerald-600"
                        : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            {sector.stream}
                          </span>
                          <span className="text-[10px] font-black text-emerald-800 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span>{sector.localDemandIndex}/100 Demand</span>
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-gray-900 truncate">
                          {sector.title}
                        </h4>
                      </div>

                      <div className="shrink-0 p-1.5 rounded-xl bg-gray-100 text-gray-500">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Salary Summary preview */}
                    <div className="mt-2.5 pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium">
                        {lang === "ur" ? "ابتدائی تنخواہ:" : "Entry Salary:"}
                      </span>
                      <span className="font-bold text-emerald-900">
                        Rs. {sector.avgSalaryPKR.entry} /mo
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredTrends.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
                  {lang === "ur" ? "کوئی شعبہ نہیں ملا۔" : "No career sectors matched your search."}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED SECTOR ANALYTICS & VISUAL CHARTS */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-5 md:p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-6">
              {/* Sector Title & Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="space-y-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {selectedSector.stream}
                  </span>
                  <h3 className="text-xl font-black text-gray-900">
                    {selectedSector.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice narration for this trend */}
                  <button
                    type="button"
                    onClick={() => speakText(spokenOverview, `trend-${selectedSector.id}`)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSpeaking && speakingId === `trend-${selectedSector.id}`
                        ? "bg-yellow-400 text-gray-900 shadow-md animate-pulse"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    title="Listen to career overview"
                  >
                    {isSpeaking && speakingId === `trend-${selectedSector.id}` ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-red-600" />
                        <span>{lang === "ur" ? "روکیں" : "Stop"}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lang === "ur" ? "آواز سنیں" : "Listen"}</span>
                      </>
                    )}
                  </button>

                  {/* Consult in Counselor */}
                  <button
                    type="button"
                    onClick={() => onConsultCareer(selectedSector.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>{lang === "ur" ? "کونسلر میں پوچھیں" : "Ask Counselor"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CHART 1: SALARY TRAJECTORY IN PAKISTAN (PKR / MONTH) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>
                      {lang === "ur" ? "تنخواہ کی متوقع حد (PKR فی ماہ)" : "Salary Trajectory in Pakistan (PKR / Month)"}
                    </span>
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">Standard Advisory Range</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {/* Entry Level */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                      {lang === "ur" ? "ابتدائی سطح (0-2 سال)" : "Entry Level (0–2 Yrs)"}
                    </span>
                    <span className="text-base font-black text-gray-900 block">
                      Rs. {selectedSector.avgSalaryPKR.entry}
                    </span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-emerald-500 h-full w-[35%] rounded-full" />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">Fresh Graduate / Trainee</span>
                  </div>

                  {/* Mid Level */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                      {lang === "ur" ? "درمیانی سطح (3-6 سال)" : "Mid Career (3–6 Yrs)"}
                    </span>
                    <span className="text-base font-black text-emerald-950 block">
                      Rs. {selectedSector.avgSalaryPKR.mid}
                    </span>
                    <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-emerald-600 h-full w-[65%] rounded-full" />
                    </div>
                    <span className="text-[10px] text-emerald-700 mt-1 block">Lead Specialist / Officer</span>
                  </div>

                  {/* Senior Level */}
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                      {lang === "ur" ? "سینئر سطح (7+ سال)" : "Senior Level (7+ Yrs)"}
                    </span>
                    <span className="text-base font-black text-teal-950 block">
                      Rs. {selectedSector.avgSalaryPKR.senior}
                    </span>
                    <div className="w-full bg-teal-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-teal-700 h-full w-[95%] rounded-full" />
                    </div>
                    <span className="text-[10px] text-teal-700 mt-1 block">Architect / Dept Head</span>
                  </div>
                </div>
              </div>

              {/* CHART 2: 5-YEAR MARKET DEMAND INDEX PROJECTION (2024 to 2028) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {lang === "ur" ? "شرح نمو و طلب کا گراف (2024 تا 2028)" : "5-Year Demand Growth Trend (2024–2028)"}
                    </span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-800">
                    +{selectedSector.yearlyGrowth[selectedSector.yearlyGrowth.length - 1].index - selectedSector.yearlyGrowth[0].index}% Projected Surge
                  </span>
                </div>

                {/* Visual SVG Growth Curve & Bars */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200">
                  <div className="grid grid-cols-5 gap-2 items-end h-32 pt-4 px-2">
                    {selectedSector.yearlyGrowth.map((point) => {
                      const heightPercent = Math.min(100, Math.max(30, (point.index / 120) * 100));
                      const isLatest = point.year === 2026;
                      return (
                        <div key={point.year} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className="text-[10px] font-black text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity">
                            {point.index}
                          </span>
                          <div
                            className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                              isLatest
                                ? "bg-gradient-to-t from-emerald-800 to-emerald-600 shadow-md ring-2 ring-emerald-400"
                                : "bg-emerald-200 hover:bg-emerald-300"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className={`text-[10px] font-bold ${isLatest ? "text-emerald-900 font-black" : "text-gray-500"}`}>
                            {point.year}
                            {isLatest && " (Now)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DEMAND RATIOS & EMPLOYMENT PIE */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{lang === "ur" ? "مقامی پاکستانی کمپنیاں" : "Local Pakistan Hiring"}</span>
                    </span>
                    <span className="text-emerald-900 font-extrabold">{selectedSector.localDemandIndex}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedSector.localDemandIndex}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-teal-700" />
                      <span>{lang === "ur" ? "بین الاقوامی ریموٹ و ایکسپورٹ" : "Remote Global Export"}</span>
                    </span>
                    <span className="text-teal-900 font-extrabold">{selectedSector.remoteExportIndex}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedSector.remoteExportIndex}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* EMPLOYMENT SHARE BAR */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
                <span className="font-bold block mb-1">
                  {lang === "ur" ? "روزگار کی تقسیم:" : "Industry Employment Distribution:"}
                </span>
                <span>{selectedSector.employmentShare}</span>
              </div>

              {/* SKILLS RADAR: RISING VS DECLINING */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Rising Skills */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2.5">
                  <h5 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "ur" ? "بڑھتی ہوئی جدید اسکلز (ان پر توجہ دیں)" : "High-Demand Rising Skills"}</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSector.risingSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Declining Skills */}
                <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2.5">
                  <h5 className="text-xs font-extrabold text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-[10px]">✕</span>
                    <span>{lang === "ur" ? "فرسودہ اسکلز (وقت ضائع نہ کریں)" : "Declining / Saturated Skills"}</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSector.decliningSkills.map((dSkill, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 text-xs font-medium border border-rose-200 line-through opacity-80"
                      >
                        {dSkill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOP INSTITUTES IN PAKISTAN */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                <h5 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "ur" ? "پاکستان کے ٹاپ بااختیار ادارے" : "Top Benchmark Pakistani Institutes"}</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedSector.topInstitutes.map((inst, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-3 py-1 rounded-xl bg-white text-gray-800 text-xs font-bold border border-gray-200 shadow-2xs flex items-center gap-1.5"
                    >
                      <Building2 className="w-3 h-3 text-emerald-700" />
                      <span>{inst}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE VIEW: INTERACTIVE 2020-2028 CAREER EVOLUTION */}
      {viewMode === "timeline" && (
        <div className="space-y-6">
          {/* Milestone Year Navigation Pills */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "ur" ? "پاکستان کیریئر و ٹیکنالوجی ٹائم لائن (2020 تا 2028)" : "Pakistan Career Evolution Timeline (2020 to 2028)"}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === "ur"
                    ? "کسی بھی سال پر کلک کریں تاکہ اس دور کا مارکیٹ شفٹ، تنخواہوں میں اضافہ اور درکار ہنر دیکھ سکیں:"
                    : "Select a milestone year to inspect market shifts, salary leaps, and the transition from 4-year degrees to micro-credentials:"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => speakText(spokenMilestone, `milestone-${activeMilestone.year}`)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSpeaking && speakingId === `milestone-${activeMilestone.year}`
                    ? "bg-yellow-400 text-gray-900 shadow-md animate-pulse"
                    : "bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {isSpeaking && speakingId === `milestone-${activeMilestone.year}` ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current text-red-600" />
                    <span>{lang === "ur" ? "روکیں" : "Stop"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === "ur" ? "اس دور کا خلاصہ سنیں" : "Listen to Era"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Horizontal Timeline Step Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
              {CAREER_TIMELINE.map((m) => {
                const isSelected = selectedMilestoneYear === m.year;
                const isNow = m.year === 2026;
                return (
                  <button
                    key={m.year}
                    type="button"
                    onClick={() => setSelectedMilestoneYear(m.year)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
                    }`}
                  >
                    {isNow && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-yellow-400 text-emerald-950 shadow-2xs">
                        Current
                      </span>
                    )}
                    <div className="text-xl font-black">{m.year}</div>
                    <div className={`text-[11px] font-bold line-clamp-1 ${isSelected ? "text-yellow-300" : "text-emerald-800"}`}>
                      {lang === "ur" ? m.eraTitleUr.split(":")[0] : m.eraTitle.split(":")[0]}
                    </div>
                    <div className={`text-[10px] mt-1 ${isSelected ? "text-emerald-100" : "text-gray-500"}`}>
                      {m.entrySalaryRangePKR.split(" ")[0]} PKR
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE MILESTONE DEEP-DIVE CARD */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-md space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                    Milestone Year: {activeMilestone.year}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">
                    {activeMilestone.year === 2026 ? "★ Present Reality" : activeMilestone.year > 2026 ? "🔮 Future Horizon" : "📜 Historical Baseline"}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  {lang === "ur" ? activeMilestone.eraTitleUr : activeMilestone.eraTitle}
                </h3>
                <p className="text-sm font-semibold text-emerald-800">
                  {lang === "ur" ? activeMilestone.themeUr : activeMilestone.theme}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Entry Salary Benchmark
                </span>
                <span className="text-xl font-black text-emerald-900">
                  {activeMilestone.entrySalaryRangePKR}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {activeMilestone.remoteExportPrevalence}
                </span>
              </div>
            </div>

            {/* Strategic Shift & Guidance for Ongoing Students */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "ur" ? "مارکیٹ کا بنیادی ارتقا" : "Market Paradigm & Hiring Reality"}</span>
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {lang === "ur" ? activeMilestone.marketShiftUr : activeMilestone.marketShift}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span>{lang === "ur" ? "ہنر مندی کی حکمت عملی (Upskilling Strategy)" : "Strategic Action for Ongoing Students"}</span>
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                  {lang === "ur" ? activeMilestone.keyUpskillingActionUr : activeMilestone.keyUpskillingAction}
                </p>
                <div className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-200/60">
                  💡 <em>Note for ongoing students (e.g. BA English, BS, or interns): Do not restart a degree from scratch. Stack 3-month targeted micro-credentials (SEO, Copywriting, UI/UX writing) to accelerate earnings.</em>
                </div>
              </div>
            </div>

            {/* Dominant Skills in this Era */}
            <div className="space-y-2">
              <span className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                Dominant Skills Driving Industry Hiring in {activeMilestone.year}:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeMilestone.dominantSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-900 border border-gray-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Sector Spotlights */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                Sector-Specific Breakdown during {activeMilestone.year}:
              </span>
              <div className="grid md:grid-cols-3 gap-3">
                {activeMilestone.sectorSpotlight.map((spot, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                    <span className="text-xs font-black text-emerald-900 block">{spot.sector}</span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{spot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-gray-500">
                Want to know how your CV or ongoing degree fits into the {activeMilestone.year} timeline?
              </div>
              <button
                type="button"
                onClick={() => onConsultCareer(`Career Timeline ${activeMilestone.year}: ${activeMilestone.eraTitle}`)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <span>{lang === "ur" ? "کونسلر سے ٹائم لائن کے بارے میں پوچھیں" : "Consult Counselor on This Era"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
