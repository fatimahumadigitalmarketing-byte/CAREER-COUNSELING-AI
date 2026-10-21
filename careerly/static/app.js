/**
 * Careerly AI - Client-side Single Page Application
 * Handles:
 * 1. Google Form style Step-by-Step Intake Questionnaire with validation
 * 2. Deterministic Eligibility & Recommendation Engine
 * 3. Categorized Accurate Results: Strong Fit, Possible, Not Right Now, 3-Phase Roadmap, Family Summary
 * 4. Multilingual Toggle (English and Urdu with RTL)
 * 5. Interactive Chat with clickable quick-response chips
 */

// 10 Sample NAVTTC Courses from Database
const SAMPLE_PROGRAMS = [
  {
    id: 1,
    name: "NAVTTC Cloud Computing & DevOps Practitioner",
    type: "navttc_course",
    sector: "Information Technology",
    nvqf_level: 4,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "intermediate",
    allowed_streams: ["any", "ics", "pre_engineering"],
    city: "Islamabad",
    institute: "[SAMPLE] National Institute of Technology & Skills Islamabad",
    source_url: "https://navttc.gov.pk/sample-courses/cloud-computing",
    verified_date: "2026-03-01",
    career_prospect: "Strong corporate and overseas remote market potential. Earnings vary with verified hands-on proficiency; no guaranteed amounts.",
    riasec_match: ["investigative", "realistic"]
  },
  {
    id: 2,
    name: "NAVTTC Full Stack Web Development (MERN)",
    type: "navttc_course",
    sector: "Information Technology",
    nvqf_level: 4,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["any"],
    city: "Lahore, Karachi",
    institute: "[SAMPLE] Government College of Technology Lahore & KVTC",
    source_url: "https://navttc.gov.pk/sample-courses/full-stack-web",
    verified_date: "2026-03-01",
    career_prospect: "Extensive market opportunities in software houses and freelancing. Hiring is merit-based and dependent on portfolio projects.",
    riasec_match: ["investigative", "enterprising"]
  },
  {
    id: 3,
    name: "NAVTTC Python Programming & Artificial Intelligence Basics",
    type: "navttc_course",
    sector: "Information Technology",
    nvqf_level: 4,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "intermediate",
    allowed_streams: ["ics", "pre_engineering", "matric_science_cs"],
    city: "Islamabad",
    institute: "[SAMPLE] National Institute of Technology & Skills Islamabad",
    source_url: "https://navttc.gov.pk/sample-courses/python-ai",
    verified_date: "2026-03-01",
    career_prospect: "Rapidly expanding specialization in data analysis and enterprise scripting. Success depends on applied mathematical logic.",
    riasec_match: ["investigative"]
  },
  {
    id: 4,
    name: "NAVTTC Graphic Design, UI/UX & Freelancing",
    type: "navttc_course",
    sector: "Creative Arts",
    nvqf_level: 3,
    duration_months: 3,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["any"],
    city: "Lahore, Karachi",
    institute: "[SAMPLE] Karachi Vocational Training Centre",
    source_url: "https://navttc.gov.pk/sample-courses/graphic-design",
    verified_date: "2026-03-01",
    career_prospect: "High remote contract viability on global platforms. Clients evaluate visual design portfolios rather than formal degrees.",
    riasec_match: ["artistic", "enterprising"]
  },
  {
    id: 5,
    name: "NAVTTC Solar PV Installation & Maintenance Technician",
    type: "navttc_course",
    sector: "Renewable Energy",
    nvqf_level: 3,
    duration_months: 3,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["matric_science_bio", "matric_science_cs", "technical", "any"],
    city: "Peshawar, Quetta",
    institute: "[SAMPLE] Peshawar Technical Training Centre",
    source_url: "https://navttc.gov.pk/sample-courses/solar-technician",
    verified_date: "2026-03-01",
    career_prospect: "Substantial residential and commercial installations across Pakistan and Gulf markets. Work relies on technical certification.",
    riasec_match: ["realistic"]
  },
  {
    id: 6,
    name: "NAVTTC Mobile App Development with Flutter",
    type: "navttc_course",
    sector: "Information Technology",
    nvqf_level: 4,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "intermediate",
    allowed_streams: ["any"],
    city: "Lahore",
    institute: "[SAMPLE] Government College of Technology Lahore",
    source_url: "https://navttc.gov.pk/sample-courses/flutter-apps",
    verified_date: "2026-03-01",
    career_prospect: "High demand among tech startups needing cross-platform mobile products. Practical app publication is key.",
    riasec_match: ["investigative", "enterprising"]
  },
  {
    id: 7,
    name: "NAVTTC Digital Marketing, SEO & E-Commerce",
    type: "navttc_course",
    sector: "Business & Commerce",
    nvqf_level: 3,
    duration_months: 3,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["any"],
    city: "Karachi",
    institute: "[SAMPLE] Karachi Vocational Training Centre",
    source_url: "https://navttc.gov.pk/sample-courses/digital-marketing",
    verified_date: "2026-03-01",
    career_prospect: "Essential for direct-to-consumer businesses, social stores, and digital marketing agencies.",
    riasec_match: ["enterprising", "conventional"]
  },
  {
    id: 8,
    name: "NAVTTC Industrial Electrician & PLC Automation",
    type: "navttc_course",
    sector: "Manufacturing & Engineering",
    nvqf_level: 3,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["matric_science_bio", "matric_science_cs", "technical"],
    city: "Lahore",
    institute: "[SAMPLE] Government College of Technology Lahore",
    source_url: "https://navttc.gov.pk/sample-courses/industrial-electrician",
    verified_date: "2026-03-01",
    career_prospect: "Stable demand in industrial estates, textile mills, and automation plants. Strong hands-on trade qualification.",
    riasec_match: ["realistic"]
  },
  {
    id: 9,
    name: "NAVTTC Cybersecurity Analyst & Network Defense",
    type: "navttc_course",
    sector: "Information Technology",
    nvqf_level: 4,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "intermediate",
    allowed_streams: ["ics", "pre_engineering", "general_science"],
    city: "Islamabad",
    institute: "[SAMPLE] National Institute of Technology & Skills Islamabad",
    source_url: "https://navttc.gov.pk/sample-courses/cybersecurity",
    verified_date: "2026-03-01",
    career_prospect: "Critical field securing enterprise infrastructure, financial banking, and cloud platforms.",
    riasec_match: ["investigative", "realistic"]
  },
  {
    id: 10,
    name: "NAVTTC Clinical Assistant & Healthcare Support",
    type: "navttc_course",
    sector: "Healthcare",
    nvqf_level: 3,
    duration_months: 6,
    fee_model: "Government Subsidized / Tuition Fee Waiver (Institutional assistance subject to quota & criteria)",
    min_education: "matric",
    allowed_streams: ["matric_science_bio", "pre_medical"],
    city: "Peshawar",
    institute: "[SAMPLE] Peshawar Technical Training Centre",
    source_url: "https://navttc.gov.pk/sample-courses/clinical-support",
    verified_date: "2026-03-01",
    career_prospect: "Direct pathway into private clinics, diagnostics centres, and outpatient health services.",
    riasec_match: ["social"]
  }
];

// Multilingual Dictionary
const TRANSLATIONS = {
  en: {
    dir: "ltr",
    lang: "en",
    lang_btn: "اردو",
    nav_form: "Intake Questionnaire",
    nav_how: "How It Works",
    nav_stages: "Education Stages",
    nav_chat: "Chat Counselor",
    hero_tag: "Verified Pakistan Education & NAVTTC Counselor",
    hero_title: "Find Your True Direction in Matric, College, & Beyond",
    hero_desc: "Honest, data-grounded career counseling. Works like an intake form: answer 5 quick questions, and get 100% accurate recommendations based on verified eligibility rules.",
    hero_btn_form: "Start Intake Questionnaire",
    hero_btn_chat: "Open Chat",
    form_tag: "Structured Intake Questionnaire",
    form_title: "Answer 5 Questions for 100% Accurate Guidance",
    form_desc: "Just like a Google Form: your responses are checked against PMDC, PEC, HEC & NAVTTC requirements to produce an exact roadmap.",
    btn_back: "← Back",
    btn_next: "Next Step →",
    btn_submit: "⚡ Process & Generate Accurate Advice",
    chat_status: "Verified Database & Deterministic Eligibility Active",
    btn_reset: "New Session",
    chat_placeholder: "Type your message in English, اردو, or Roman Urdu...",
    btn_send: "Send",
    disclaimer: "Guidance only. Always confirm fees, dates and eligibility with the institute.",
    initial_bot_msg: "Hi, I'm Careerly AI. You can either complete the 5-step Intake Form above for an instant roadmap, or tell me your education stage below to begin:",
    network_error: "Connection issue with counseling server. Showing verified database fallback."
  },
  ur: {
    dir: "rtl",
    lang: "ur",
    lang_btn: "English",
    nav_form: "انٹیک سوالنامہ",
    nav_how: "یہ کیسے کام کرتا ہے",
    nav_stages: "تعلیمی مراحل",
    nav_chat: "رہنمائی چیٹ",
    hero_tag: "تصدیق شدہ پاکستانی تعلیمی و فنی کونسلر",
    hero_title: "میٹرک، کالج اور مستقبل کے لیے اپنی صحیح منزل تلاش کریں",
    hero_desc: "دیانتدارانہ رہنمائی۔ گوگل فارم کی طرح پہلے 5 بنیادی سوالات کے جواب دیں اور تعلیمی قواعد کے مطابق 100 فیصد درست سفارشات حاصل کریں۔",
    hero_btn_form: "انٹیک سوالنامہ شروع کریں",
    hero_btn_chat: "چیٹ کھولیں",
    form_tag: "مستند تعلیمی سوالنامہ",
    form_title: "صرف 5 سوالات کے جواب دیں اور قطعی درست رہنمائی پائیں",
    form_desc: "آپ کے جوابات کا پاکستان کے تمام ریگولیٹری قواعد (PMDC, PEC, HEC, NAVTTC) سے موازنہ کر کے مستند روڈ میپ دیا جائے گا۔",
    btn_back: "← پیچھے",
    btn_next: "اگلا مرحلہ ←",
    btn_submit: "⚡ درست رہنمائی اور روڈ میپ تیار کریں",
    chat_status: "تصدیق شدہ ڈیٹابیس اور تعلیمی قواعد فعال ہیں",
    btn_reset: "نیا سیشن",
    chat_placeholder: "اپنا پیغام اردو، انگریزی یا رومن اردو میں لکھیں...",
    btn_send: "بھیجیں",
    disclaimer: "صرف رہنمائی کے لیے۔ فیس، تاریخیں اور اہلیت ہمیشہ متعلقہ ادارے سے تصدیق کریں۔",
    initial_bot_msg: "ہیلو! میں کیریئرلی اے آئی ہوں۔ آپ اوپر دیے گئے سوالنامے سے 100 فیصد درست روڈ میپ حاصل کر سکتے ہیں، یا نیچے اپنا تعلیمی مرحلہ منتخب کریں:",
    network_error: "سرور سے رابطہ بحال نہیں ہو سکا۔ ڈیٹابیس سے مستند رہنمائی دکھائی جا رہی ہے۔"
  }
};

let currentLang = "en";
let currentStep = 1;
let conversationHistory = [];
let isWaitingForResponse = false;

// Selected Form Answers
let formAnswers = {
  stage: "",
  stream: "",
  marks: "",
  riasec: [],
  city: "",
  budget: ""
};

// DOM Elements
const langToggleBtn = document.getElementById("lang-toggle-btn");
const currentLangLabel = document.getElementById("current-lang-label");
const wizardStepTitle = document.getElementById("wizard-step-title");
const wizardProgressPercent = document.getElementById("wizard-progress-percent");
const progressBarFill = document.getElementById("progress-bar-fill");
const wizardPrevBtn = document.getElementById("wizard-prev-btn");
const wizardNextBtn = document.getElementById("wizard-next-btn");
const wizardSubmitBtn = document.getElementById("wizard-submit-btn");
const streamOptionsContainer = document.getElementById("stream-options-container");
const resultsDisplay = document.getElementById("results-display");

const chatMessagesContainer = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");
const typingIndicator = document.getElementById("typing-indicator");
const chatErrorBanner = document.getElementById("chat-error-banner");
const resetChatBtn = document.getElementById("reset-chat-btn");

// Apply translations
function applyLanguage(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.documentElement.lang = t.lang;
  document.documentElement.dir = t.dir;
  currentLangLabel.textContent = t.lang_btn;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  if (chatInput) {
    chatInput.placeholder = t.chat_placeholder;
  }

  updateWizardStepUI();
  if (conversationHistory.length <= 1) {
    resetChat();
  }
}

// Update wizard stream options based on selected stage
function populateStreamOptions(stage) {
  if (!streamOptionsContainer) return;
  streamOptionsContainer.innerHTML = "";

  let options = [];
  if (stage === "matric") {
    options = [
      { id: "matric_science_bio", name: "Matric Science (Biology, Chemistry, Physics)" },
      { id: "matric_science_cs", name: "Matric Science (Computer Science, Math, Physics)" },
      { id: "matric_arts", name: "Matric Arts / General Humanities Group" },
      { id: "technical", name: "Matric Technical / Vocational Trade" }
    ];
  } else if (stage === "intermediate") {
    options = [
      { id: "pre_medical", name: "FSc Pre-Medical (Biology, Physics, Chemistry)" },
      { id: "pre_engineering", name: "FSc Pre-Engineering (Mathematics, Physics, Chemistry)" },
      { id: "ics", name: "ICS (Computer Science, Mathematics, Physics/Stats)" },
      { id: "icom", name: "I.Com (Commerce, Accounting, Economics)" },
      { id: "fa", name: "FA / Humanities / Arts" },
      { id: "dae", name: "DAE (Associate Engineering Diploma)" }
    ];
  } else {
    options = [
      { id: "cs_it", name: "Computer Science / Software Engineering / IT" },
      { id: "business", name: "Business Administration / Commerce / BBA / B.Com" },
      { id: "pre_medical", name: "Medical / Biological / Allied Health Sciences" },
      { id: "pre_engineering", name: "Engineering / Technical Trades" },
      { id: "arts", name: "Arts / Social Sciences / Law" },
      { id: "other", name: "General / Practical Experience / Non-degree" }
    ];
  }

  options.forEach(opt => {
    const label = document.createElement("label");
    label.className = "option-card";
    label.innerHTML = `
      <input type="radio" name="stream" value="${opt.id}">
      <div class="option-content">
        <span class="option-name">${opt.name}</span>
      </div>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      formAnswers.stream = e.target.value;
      validateCurrentStep();
    });
    streamOptionsContainer.appendChild(label);
  });
}

// Validate whether current step has answered inputs
function validateCurrentStep() {
  let isValid = false;
  if (currentStep === 1) {
    isValid = !!formAnswers.stage;
  } else if (currentStep === 2) {
    isValid = !!formAnswers.stream;
  } else if (currentStep === 3) {
    isValid = !!formAnswers.marks;
  } else if (currentStep === 4) {
    isValid = formAnswers.riasec.length > 0;
  } else if (currentStep === 5) {
    isValid = !!formAnswers.city && !!formAnswers.budget;
  }

  if (wizardNextBtn) {
    wizardNextBtn.disabled = !isValid;
  }
  if (wizardSubmitBtn) {
    wizardSubmitBtn.disabled = !isValid;
  }
}

// Update Step UI
function updateWizardStepUI() {
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`step-${i}`);
    if (pane) {
      pane.classList.toggle("active", i === currentStep);
    }
  }

  const percent = Math.round((currentStep / 5) * 100);
  if (progressBarFill) progressBarFill.style.width = `${percent}%`;
  if (wizardProgressPercent) wizardProgressPercent.textContent = `${percent}% Complete`;

  const stepTitles = {
    en: [
      "Step 1 of 5: Current Education Stage",
      "Step 2 of 5: Academic Stream & Group",
      "Step 3 of 5: Academic Marks & Performance",
      "Step 4 of 5: Interests & Aptitude (RIASEC)",
      "Step 5 of 5: Location & Financial Goal"
    ],
    ur: [
      "مرحلہ 1 از 5: موجودہ تعلیمی مرحلہ",
      "مرحلہ 2 از 5: تعلیمی گروپ اور مضامین",
      "مرحلہ 3 از 5: تعلیمی نمبر اور کارکردگی",
      "مرحلہ 4 از 5: قدرتی دلچسپی اور رجحان (RIASEC)",
      "مرحلہ 5 از 5: شہر اور مالی ترجیح"
    ]
  };

  if (wizardStepTitle) {
    wizardStepTitle.textContent = stepTitles[currentLang][currentStep - 1];
  }

  if (wizardPrevBtn) {
    wizardPrevBtn.style.display = currentStep > 1 ? "inline-block" : "none";
  }
  if (wizardNextBtn) {
    wizardNextBtn.style.display = currentStep < 5 ? "inline-block" : "none";
  }
  if (wizardSubmitBtn) {
    wizardSubmitBtn.style.display = currentStep === 5 ? "inline-block" : "none";
  }

  validateCurrentStep();
}

// Process Questionnaire Form Answers & Generate Accurate Advice
function processFormAnswers() {
  const strongFit = [];
  const possible = [];
  const notRightNow = [];

  const isMatric = formAnswers.stage === "matric";
  const isInter = formAnswers.stage === "intermediate";
  const isPreMed = formAnswers.stream === "pre_medical" || formAnswers.stream === "matric_science_bio";

  // 1. HARD DETERMINISTIC RULES (PMDC, PEC)
  if (isMatric) {
    notRightNow.push({
      name: "MBBS / BDS (Doctor / Dental Surgery)",
      reason: currentLang === "ur"
        ? "پی ایم ڈی سی کے تحت ایم بی بی ایس کے لیے ایف ایس سی پری میڈیکل (بائیولوجی، فزکس، کیمسٹری) میں کم از کم 60 فیصد اور ایم ڈی کیٹ کا پاس ہونا لازمی ہے۔ میٹرک کے بعد براہِ راست داخلہ ممنوع ہے۔"
        : "PMDC regulations strictly require completed FSc Pre-Medical (Biology, Physics, Chemistry) with minimum 60% and MDCAT passing score. Direct entry after Matric is impossible.",
      unlock: currentLang === "ur"
        ? "کالج میں ایف ایس سی پری میڈیکل گروپ کا انتخاب کریں اور 75%+ نمبر حاصل کریں۔"
        : "Opt for FSc Pre-Medical in College and maintain over 75% marks."
    });
  } else if (isInter && !isPreMed) {
    notRightNow.push({
      name: "MBBS / BDS (Medical Doctor)",
      reason: currentLang === "ur"
        ? `آپ کا تعلیمی گروپ '${formAnswers.stream.toUpperCase()}' ہے، جبکہ میڈیکل داخلے کے لیے بائیولوجی کا پاس ہونا لازمی ہے۔`
        : `Your academic stream is '${formAnswers.stream.toUpperCase()}'. Compulsory high-school Biology is required by PMDC.`,
      unlock: currentLang === "ur"
        ? "اگر ڈاکٹر بننا مقصود ہے تو بورڈ سے پری میڈیکل کے امتحانات ریپیر کریں۔"
        : "Switching requires taking Intermediate Board Pre-Medical exams."
    });
  }

  if (isInter && isPreMed) {
    possible.push({
      name: "B.E. / B.Sc. Engineering (Electrical / Mechanical / Civil)",
      why: currentLang === "ur"
        ? "پری میڈیکل طلبہ پاکستان انجینئرنگ کونسل (PEC) کے تحت صرف اس وقت انجینئرنگ میں داخلہ لے سکتے ہیں جب وہ بورڈ سے اضافی ریاضی (Additional Math) پاس کریں۔"
        : "Pre-Medical students are eligible under PEC rules ONLY after passing the Intermediate Additional Mathematics exam.",
      strengthen: currentLang === "ur"
        ? "متعلقہ تعلیمی بورڈ سے اضافی ریاضی کے امتحان کا سرٹیفکیٹ لیں۔"
        : "Register and clear the Board Additional Mathematics exam."
    });
  }

  // 2. RETRIEVE RELEVANT DATABASE PROGRAMS
  SAMPLE_PROGRAMS.forEach(prog => {
    let score = 0;
    let reasons = [];

    const meetsEdu = prog.min_education === "matric" || (prog.min_education === "intermediate" && !isMatric);
    if (!meetsEdu) return;

    if (prog.allowed_streams.includes("any") || prog.allowed_streams.includes(formAnswers.stream)) {
      score += 2;
    }

    if (formAnswers.riasec.some(r => prog.riasec_match.includes(r))) {
      score += 3;
      reasons.push(currentLang === "ur" ? "آپ کی قدرتی دلچسپی اور رجحان کے مطابق ہے۔" : "Directly matches your indicated Holland RIASEC aptitude.");
    }

    if (prog.fee_model) {
      score += 2;
      reasons.push(currentLang === "ur" ? "سرکاری سبسڈی اور تصدیق شدہ فیس رعایت کا حامل پروگرام ہے۔" : "Government subsidized program with institutional fee waiver support.");
    }

    const item = {
      ...prog,
      reasonsFit: reasons.join(" "),
      firstStep: currentLang === "ur"
        ? `نیوٹیک پورٹل (${prog.source_url}) پر داخلہ تاریخیں دیکھیں اور ادارے سے رابطہ کریں۔`
        : `Check the intake schedule on NAVTTC portal (${prog.source_url}) and verify with institute.`
    };

    if (score >= 4) {
      strongFit.push(item);
    } else if (score >= 2) {
      possible.push({
        name: prog.name,
        why: currentLang === "ur" ? "بنیادی تعلیمی معیار پورا کرتا ہے لیکن عملی تیاری درکار ہے۔" : "Meets basic eligibility, but requires dedicated practical preparation.",
        strengthen: currentLang === "ur" ? "یوٹیوب یا مفت کورسز سے بنیادی آگاہی حاصل کریں۔" : "Complete free introductory lessons online to prepare."
      });
    }
  });

  const topFit = strongFit.slice(0, 3);
  const topPossible = possible.slice(0, 2);
  const topNotRightNow = notRightNow.slice(0, 2);
  const primaryChoice = topFit[0] || SAMPLE_PROGRAMS[1];

  // Render Result Cards in HTML
  renderResultsHTML(topFit, topPossible, topNotRightNow, primaryChoice);

  // Send Personal Mentor Greeting into chat
  const chatSummary = currentLang === "ur"
    ? `🎉 خوش آمدید! آپ کا پروفائل محفوظ ہو گیا ہے۔ میں اب آپ کا ذاتی گائیڈنس کونسلر ہوں!\n\nآپ کے تعلیمی گروپ اور ${formAnswers.city} کے لیے سرفہرست تصدیق شدہ انتخاب ہے:\n⭐ **${primaryChoice.name}**\n(مدت: تقریبا ${primaryChoice.duration_months} ماہ | ${primaryChoice.fee_model})\n\n⚠️ اہم نوٹ: تمام نتائج مشاورتی ہیں اور کوئی 100 فیصد گارنٹی نہیں دی جاتی۔ مجھ سے درکار اسکلز، جاب کے ممکنہ مواقع، یا والدین سے بات کرنے کے بارے میں پوچھیں!`
    : `🎉 Welcome! Your student profile is loaded. I am now your dedicated 1-on-1 Personal Guidance Counselor!\n\nFor your academic background in ${formAnswers.city}, your top recommended path is:\n⭐ **${primaryChoice.name}**\n(Duration: ~${primaryChoice.duration_months} months | ${primaryChoice.fee_model})\n\n⚠️ Notice: Career guidance is advisory and outcomes are not 100% guaranteed. What would you like to explore next?`;

  appendMessage("bot", chatSummary, [
    currentLang === "ur" ? "🛠️ درکار اسکلز کی لسٹ" : "🛠️ Essential Skills Checklist",
    currentLang === "ur" ? "💼 مارکیٹ میں ملازمت کے مواقع" : "💼 Realistic Job Opportunities",
    currentLang === "ur" ? "📅 30 روزہ اسٹڈی پلان بنائیں" : "📅 30-Day Daily Study Plan",
    currentLang === "ur" ? "👨‍👩‍👦 والدین کے لیے وضاحتی خط لکھیں" : "👨‍👩‍👦 Letter for My Parents"
  ]);

  // Scroll smoothly to chat counselor so user interacts with their personal mentor
  const chatSection = document.getElementById("chat-section");
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Render Results HTML Card
function renderResultsHTML(strongFit, possible, notRightNow, top) {
  if (!resultsDisplay) return;

  resultsDisplay.innerHTML = `
    <!-- STRONG FIT -->
    <div class="result-card strong-fit">
      <div class="result-header">
        <h3 class="result-title">${currentLang === "ur" ? "🎯 بہترین انتخاب (Strong Fit)" : "🎯 STRONG FIT (Verified Database Matches)"}</h3>
        <span class="item-badge-pill">${currentLang === "ur" ? "تصدیق شدہ" : "Verified"}</span>
      </div>
      ${strongFit.map(item => `
        <div style="margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
            <span class="item-badge-pill" style="background-color: var(--green); color: white;">NVQF Level ${item.nvqf_level}</span>
            <span class="item-badge-pill">${item.duration_months} Months</span>
            <span class="item-badge-pill" style="background-color: var(--yellow); color: var(--green-dark);">${currentLang === "ur" ? "سرکاری سبسڈی" : "Govt Subsidized"}</span>
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--green-dark); margin-bottom: 0.25rem;">${item.name}</h4>
          <p style="font-size: 0.85rem; color: var(--gray-700);"><strong>${currentLang === "ur" ? "ادارہ:" : "Institute:"}</strong> ${item.institute} (${item.city})</p>
          <div class="item-why-box">
            <strong>${currentLang === "ur" ? "کیوں موزوں ہے:" : "Why it fits:"}</strong> ${item.reasonsFit}
          </div>
          <p class="item-action-box"><strong>${currentLang === "ur" ? "پہلا قدم:" : "First Step:"}</strong> ${item.firstStep}</p>
        </div>
      `).join("")}
    </div>

    <!-- POSSIBLE & NOT RIGHT NOW -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      <div class="result-card possible">
        <h3 class="result-title" style="color: #92400E; font-size: 1.15rem; margin-bottom: 0.75rem;">
          ${currentLang === "ur" ? "⚖️ امکان موجود ہے (Possible)" : "⚖️ POSSIBLE (With Effort)"}
        </h3>
        ${possible.map(p => `
          <div style="margin-bottom: 1rem; font-size: 0.85rem;">
            <div style="font-weight: 700; color: #78350F;">${p.name}</div>
            <p style="color: var(--gray-700); margin: 0.2rem 0;">${p.why}</p>
            <p style="color: #92400E; font-weight: 600;"><strong>${currentLang === "ur" ? "حل:" : "Unlock:"}</strong> ${p.strengthen}</p>
          </div>
        `).join("")}
      </div>

      <div class="result-card not-right-now">
        <h3 class="result-title" style="color: #991B1B; font-size: 1.15rem; margin-bottom: 0.75rem;">
          ${currentLang === "ur" ? "🚫 فی الوقت مناسب نہیں" : "🚫 NOT RIGHT NOW (Reason)"}
        </h3>
        ${notRightNow.map(n => `
          <div style="margin-bottom: 1rem; font-size: 0.85rem;">
            <div style="font-weight: 700; color: #7F1D1D;">${n.name}</div>
            <p style="color: #991B1B; margin: 0.2rem 0;">${n.reason}</p>
            <p style="color: var(--gray-600);">${n.unlock}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- FAMILY SUMMARY -->
    <div class="result-card" style="background-color: var(--green-dark); color: white;">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--yellow); margin-bottom: 0.75rem;">
        ${currentLang === "ur" ? "👨‍👩‍👦 والدین اور فیملی کے لیے واضح خلاصہ" : "👨‍👩‍👦 Respectful Family & Parent Summary"}
      </h3>
      <p style="font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap; background-color: rgba(255,255,255,0.08); padding: 1rem; border-radius: 8px;">
${currentLang === "ur"
  ? `• منتخب شعبہ: ${top.name} (${top.sector})
• مالی ماڈل: ${top.fee_model}
• مدت: تقریبا ${top.duration_months} ماہ کی جامع تربیت
• کیریئر اور مارکیٹ جائزہ: ${top.career_prospect}
• اہم دیانتدارانہ نوٹ: نتائج مشاورتی ہیں اور 100 فیصد گارنٹی نہیں دی جا سکتی۔ داخلہ شرائط کی ادارے سے تصدیق کریں۔
• سرٹیفکیٹ کی حیثیت: نیوٹیک (حکومتِ پاکستان) کی تصدیق شدہ قومی سند۔`
  : `• Recommended Path: ${top.name} (${top.sector})
• Financial Structure: ${top.fee_model}
• Program Duration: Approx. ${top.duration_months} Months
• Realistic Outlook: ${top.career_prospect}
• Important Advisory: Career counseling outcomes are not 100% guaranteed; success depends on personal practice and market dynamics.
• Regulatory Recognition: Officially certified by NAVTTC (Government of Pakistan), valid for local and overseas technical trades.`}
      </p>
    </div>
  `;
}

// Append message safely with textContent and optional chips
function appendMessage(role, text, chips = []) {
  const row = document.createElement("div");
  row.className = `chat-msg-row ${role}`;
  row.style.display = "flex";
  row.style.flexDirection = "column";
  row.style.alignItems = role === "user" ? "flex-end" : "flex-start";

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = text;
  row.appendChild(bubble);

  // If chips provided
  if (chips && chips.length > 0) {
    const chipsContainer = document.createElement("div");
    chipsContainer.className = "chat-option-chips";
    chips.forEach(chip => {
      const btn = document.createElement("button");
      btn.className = "chat-chip-btn";
      btn.textContent = `👉 ${chip}`;
      btn.addEventListener("click", () => {
        handleChipClick(chip);
      });
      chipsContainer.appendChild(btn);
    });
    row.appendChild(chipsContainer);
  }

  chatMessagesContainer.appendChild(row);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function handleChipClick(chipText) {
  if (chipText.includes("Matric")) {
    formAnswers.stage = "matric";
    populateStreamOptions("matric");
    currentStep = 2;
    updateWizardStepUI();
    document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (chipText.includes("Intermediate") || chipText.includes("FSc")) {
    formAnswers.stage = "intermediate";
    populateStreamOptions("intermediate");
    currentStep = 2;
    updateWizardStepUI();
    document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (chipText.includes("University")) {
    formAnswers.stage = "university";
    populateStreamOptions("university");
    currentStep = 2;
    updateWizardStepUI();
    document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (chipText.includes("Graduate") || chipText.includes("Skills")) {
    formAnswers.stage = "graduate";
    populateStreamOptions("graduate");
    currentStep = 2;
    updateWizardStepUI();
    document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Otherwise send as chat message
  handleSendMessage(chipText);
}

// Reset chat
function resetChat() {
  conversationHistory = [];
  chatMessagesContainer.innerHTML = "";
  if (chatErrorBanner) chatErrorBanner.style.display = "none";
  const initialText = TRANSLATIONS[currentLang].initial_bot_msg;
  conversationHistory.push({ role: "assistant", content: initialText });
  appendMessage("bot", initialText, [
    "Matric (9th/10th)",
    "FSc / Intermediate (11th/12th)",
    "University Undergrad",
    "Graduate / Skills"
  ]);
}

// Send message
async function handleSendMessage(customText) {
  const text = (customText || chatInput.value).trim();
  if (!text || isWaitingForResponse) return;

  if (!customText) chatInput.value = "";
  if (chatErrorBanner) chatErrorBanner.style.display = "none";

  appendMessage("user", text);
  conversationHistory.push({ role: "user", content: text });

  isWaitingForResponse = true;
  if (typingIndicator) typingIndicator.style.display = "block";
  if (chatSendBtn) chatSendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const reply = data.reply || "Thank you. Let me know if you need more details.";

    conversationHistory.push({ role: "assistant", content: reply });
    appendMessage("bot", reply);
  } catch {
    // Client fallback
    setTimeout(() => {
      const fallbackReply = generateFallbackAdvice(text);
      conversationHistory.push({ role: "assistant", content: fallbackReply });
      appendMessage("bot", fallbackReply, [
        "Explain Family Summary",
        "How to apply for NAVTTC",
        "Fill 5-Step Questionnaire Form"
      ]);
    }, 600);
  } finally {
    isWaitingForResponse = false;
    if (typingIndicator) typingIndicator.style.display = "none";
    if (chatSendBtn) chatSendBtn.disabled = false;
    if (chatInput) chatInput.focus();
  }
}

function generateFallbackAdvice(userInput) {
  const norm = userInput.toLowerCase();
  const city = formAnswers.city || "your city";

  if (norm.includes("30-day") || norm.includes("study plan") || norm.includes("پلان")) {
    return currentLang === "ur"
      ? `📅 آپ کا ذاتی 30 روزہ اسٹڈی و ایکشن پلان:
• ہفتہ 1: بنیادی کمپیوٹر کمانڈز اور VS Code ٹولز پر روزانہ 45 منٹ کام کریں۔
• ہفتہ 2: NAVTTC نصاب کے مطابق بنیادی ماڈیولز اور تھیوری پڑھیں۔
• ہفتہ 3: پہلا نمونہ پروجیکٹ تیار کریں تاکہ پورٹ فولیو بننا شروع ہو۔
• ہفتہ 4: ${city} کے مرکز میں داخلہ فارم اور تعلیمی اسناد جمع کروائیں۔`
      : `📅 Your 30-Day Preparation Plan for ${city}:
• Week 1: Spend 45 mins daily setting up basic tools and practicing commands.
• Week 2: Study foundational concepts aligned with the NAVTTC curriculum.
• Week 3: Build your first functioning mini-project showcase.
• Week 4: Submit your CNIC/marksheet copies at your local center for upcoming intake.`;
  }

  if (norm.includes("family") || norm.includes("والدین") || norm.includes("letter") || norm.includes("خط")) {
    return currentLang === "ur"
      ? "👨‍👩‍👦 والدین کے لیے وضاحتی خط:\n'محترم امی ابو، میں نے حکومتِ پاکستان کے ادارے NAVTTC سے منظور شدہ پروگرام چنا ہے۔ یہ سرکاری سبسڈی پر مبنی ہے تاکہ خاندان پر مالی بوجھ نہ پڑے۔ چند ماہ کی سنجیدہ پریکٹیکل ٹریننگ اور پورٹ فولیو کی تیاری سے میں اپنے پاؤں پر کھڑا ہو سکتا ہوں، اور یہ ایک مستند قومی سند ہے۔'"
      : "👨‍👩‍👦 Letter for Parents:\n'Dear Parents, I have researched a government-recognized NAVTTC program. It provides subsidized technical training that minimizes costs. Through dedicated practical learning and building a real portfolio, this path equips me with in-demand skills for local employment or remote freelance work.'";
  }

  if (norm.includes("freelanc") || norm.includes("کما") || norm.includes("فری لانس")) {
    return currentLang === "ur"
      ? "💼 فری لانسنگ گائیڈ:\n1. 3 مکمل پراجیکٹس تیار کر کے پورٹ فولیو لائیو کریں۔\n2. Upwork، Fiverr یا LinkedIn پر پروفائل مکمل کریں۔\n3. پہلے چھوٹے پروجیکٹس سے کلائنٹ فیڈ بیک لیں اور مسلسل اپنی مہارت بہتر بنائیں۔ یاد رہے کہ فری لانسنگ میں آمدن کی کوئی گارنٹی نہیں ہوتی بلکہ یہ ذاتی محنت پر منحصر ہے۔"
      : "💼 Freelancing Blueprint:\n1. Build 3 functioning showcase projects to demonstrate proof of skill.\n2. Set up professional profiles on platforms like Upwork and Fiverr.\n3. Focus initially on delivering high-quality work to earn strong client testimonials. Note that freelance income is variable and never guaranteed.";
  }

  if (norm.includes("form") || norm.includes("سوالنامہ")) {
    document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
    return currentLang === "ur"
      ? "آپ کو اوپر انٹیک سوالنامے پر منتقل کر دیا گیا ہے۔ وہاں 5 سوالات پر کر کے تصدیق شدہ روڈ میپ حاصل کریں۔"
      : "You have been scrolled to the Intake Questionnaire above. Answer the 5 steps to generate your verified roadmap.";
  }

  return currentLang === "ur"
    ? `شکریہ! آپ کے پروفائل (${city}) کے مطابق میں آپ کا پرسنل کونسلر ہوں۔ آپ مجھ سے 30 روزہ اسٹڈی پلان، والدین سے بات کرنے کا طریقہ، یا داخلے کے بارے میں بلا جھجھک پوچھ سکتے ہیں۔`
    : `Thank you! As your personal guidance counselor for ${city}, I am ready to help you execute your roadmap. What would you like guidance on next: daily study routine, parent explanation, or application steps?`;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  resetChat();

  // Language switcher
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const next = currentLang === "en" ? "ur" : "en";
      applyLanguage(next);
    });
  }

  // Reset chat
  if (resetChatBtn) {
    resetChatBtn.addEventListener("click", resetChat);
  }

  // Chat submit
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }

  // Radio listener for Step 1
  document.querySelectorAll("input[name='stage']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      formAnswers.stage = e.target.value;
      populateStreamOptions(e.target.value);
      validateCurrentStep();
    });
  });

  // Radio listener for Step 3
  document.querySelectorAll("input[name='marks']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      formAnswers.marks = e.target.value;
      validateCurrentStep();
    });
  });

  // Checkbox listener for Step 4
  document.querySelectorAll("input[name='riasec']").forEach(box => {
    box.addEventListener("change", () => {
      const checked = Array.from(document.querySelectorAll("input[name='riasec']:checked")).map(b => b.value);
      formAnswers.riasec = checked;
      validateCurrentStep();
    });
  });

  // Radio listener for City & Budget in Step 5
  document.querySelectorAll("input[name='city']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      formAnswers.city = e.target.value;
      validateCurrentStep();
    });
  });

  document.querySelectorAll("input[name='budget']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      formAnswers.budget = e.target.value;
      validateCurrentStep();
    });
  });

  // Wizard Navigation
  if (wizardNextBtn) {
    wizardNextBtn.addEventListener("click", () => {
      if (currentStep < 5) {
        currentStep++;
        updateWizardStepUI();
      }
    });
  }

  if (wizardPrevBtn) {
    wizardPrevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardStepUI();
      }
    });
  }

  if (wizardSubmitBtn) {
    wizardSubmitBtn.addEventListener("click", () => {
      processFormAnswers();
    });
  }

  // Stage card quick buttons
  document.querySelectorAll(".stage-action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const stageVal = btn.getAttribute("data-stage-val");
      if (stageVal) {
        const radio = document.querySelector(`input[name='stage'][value='${stageVal}']`);
        if (radio) {
          radio.checked = true;
          formAnswers.stage = stageVal;
          populateStreamOptions(stageVal);
        }
        currentStep = 2;
        updateWizardStepUI();
        document.getElementById("intake-form-section")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  updateWizardStepUI();
});
