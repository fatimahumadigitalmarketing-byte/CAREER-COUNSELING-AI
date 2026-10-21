/**
 * Sample Pakistani Educational Document & Certificate High-Res Visual Illustrations
 * Rendered as scalable SVG Data URIs so students can immediately view certificates in image format.
 */

// 1. BISE Lahore Matriculation Science Result Card (Official Green & Gold Border)
export const SAMPLE_MATRIC_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFBF7"/>
      <stop offset="100%" stop-color="#F4EEDB"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#AA771C"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>

  <!-- Certificate Parchment Background -->
  <rect width="800" height="550" fill="url(#bgGrad)"/>

  <!-- Ornate Double Borders -->
  <rect x="20" y="20" width="760" height="510" fill="none" stroke="#0B4228" stroke-width="8"/>
  <rect x="32" y="32" width="736" height="486" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
  <rect x="38" y="38" width="724" height="474" fill="none" stroke="#0B4228" stroke-width="1" stroke-dasharray="6,4"/>

  <!-- Corner Flourishes -->
  <g fill="#0B4228">
    <circle cx="28" cy="28" r="5"/>
    <circle cx="772" cy="28" r="5"/>
    <circle cx="28" cy="522" r="5"/>
    <circle cx="772" cy="522" r="5"/>
  </g>

  <!-- Board Emblem / Crescent Star -->
  <g transform="translate(400, 75)" text-anchor="middle">
    <circle cx="0" cy="0" r="28" fill="#0B4228"/>
    <circle cx="0" cy="0" r="25" fill="#FFFFFF"/>
    <circle cx="0" cy="0" r="22" fill="#0B4228"/>
    <path d="M-4,-10 A14,14 0 1,0 12,8 A12,12 0 1,1 -4,-10 Z" fill="#D4AF37"/>
    <polygon points="5,-5 7,-1 11,-1 8,2 9,6 5,3 1,6 2,2 -1,-1 3,-1" fill="#D4AF37"/>
  </g>

  <!-- Header Titles -->
  <text x="400" y="125" font-family="Georgia, serif" font-size="19" font-weight="bold" fill="#0B4228" text-anchor="middle" letter-spacing="1">
    BOARD OF INTERMEDIATE &amp; SECONDARY EDUCATION
  </text>
  <text x="400" y="145" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#555555" text-anchor="middle" letter-spacing="2">
    LAHORE, PAKISTAN
  </text>
  <text x="400" y="172" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#B8860B" text-anchor="middle">
    SECONDARY SCHOOL CERTIFICATE EXAMINATION (ANNUAL 2023)
  </text>

  <!-- Certificate Body -->
  <text x="400" y="210" font-family="Georgia, serif" font-size="13" fill="#333333" text-anchor="middle">
    This is to certify that
  </text>
  <text x="400" y="238" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#0B4228" text-anchor="middle" text-decoration="underline">
    MUHAMMAD BILAL TARIQ
  </text>

  <text x="400" y="265" font-family="Georgia, serif" font-size="13" fill="#333333" text-anchor="middle">
    Roll No: <tspan font-weight="bold">549102</tspan> &nbsp;|&nbsp; Enrolment No: <tspan font-weight="bold">LHR-2021-99814</tspan>
  </text>
  <text x="400" y="285" font-family="Georgia, serif" font-size="13" fill="#333333" text-anchor="middle">
    has successfully satisfied the requirements in the <tspan font-weight="bold" fill="#0B4228">SCIENCE GROUP</tspan>
  </text>

  <!-- Marks Breakdown Table -->
  <g transform="translate(100, 310)">
    <rect width="600" height="95" fill="#FFFFFF" stroke="#0B4228" stroke-width="1.5" rx="4"/>
    <line x1="0" y1="28" x2="600" y2="28" stroke="#0B4228" stroke-width="1"/>
    
    <!-- Table Header -->
    <text x="20" y="19" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">SUBJECT</text>
    <text x="220" y="19" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">MAX MARKS</text>
    <text x="360" y="19" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">OBTAINED</text>
    <text x="500" y="19" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">REMARKS</text>

    <!-- Table Rows -->
    <text x="20" y="48" font-family="Arial, sans-serif" font-size="11" fill="#333333">Mathematics (Advanced)</text>
    <text x="245" y="48" font-family="Arial, sans-serif" font-size="11" fill="#333333">75</text>
    <text x="385" y="48" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">73</text>
    <text x="505" y="48" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#2E7D32">Distinction</text>

    <text x="20" y="68" font-family="Arial, sans-serif" font-size="11" fill="#333333">Physics &amp; Chemistry</text>
    <text x="245" y="68" font-family="Arial, sans-serif" font-size="11" fill="#333333">150</text>
    <text x="385" y="68" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">136</text>
    <text x="505" y="68" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#2E7D32">Practical Pass</text>

    <text x="20" y="88" font-family="Arial, sans-serif" font-size="11" fill="#333333">Computer Science Theory &amp; Lab</text>
    <text x="245" y="88" font-family="Arial, sans-serif" font-size="11" fill="#333333">75</text>
    <text x="385" y="88" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">72</text>
    <text x="505" y="88" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#2E7D32">Grade A1</text>
  </g>

  <!-- Total Summary -->
  <text x="400" y="430" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#0B4228" text-anchor="middle">
    TOTAL MARKS: 914 / 1100 &nbsp;|&nbsp; PERCENTAGE: 83.1% &nbsp;|&nbsp; GRADE: A1 (EXCELLENT)
  </text>

  <!-- Official Embossed Stamp -->
  <g transform="translate(660, 455)">
    <circle cx="0" cy="0" r="32" fill="#D4AF37" opacity="0.25"/>
    <circle cx="0" cy="0" r="28" fill="none" stroke="#B8860B" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="0" y="-8" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#B8860B" text-anchor="middle">OFFICIAL</text>
    <text x="0" y="2" font-family="Arial, sans-serif" font-size="8" font-weight="black" fill="#0B4228" text-anchor="middle">VERIFIED</text>
    <text x="0" y="12" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#B8860B" text-anchor="middle">BISE LAHORE</text>
  </g>

  <!-- Signatures -->
  <line x1="100" y1="490" x2="240" y2="490" stroke="#555555" stroke-width="1"/>
  <text x="170" y="505" font-family="Arial, sans-serif" font-size="10" fill="#666666" text-anchor="middle">Controller of Examinations</text>

  <line x1="380" y1="490" x2="520" y2="490" stroke="#555555" stroke-width="1"/>
  <text x="450" y="505" font-family="Arial, sans-serif" font-size="10" fill="#666666" text-anchor="middle">Chairman Board of Education</text>
</svg>
`)}`;

// 2. BISE Higher Secondary School Certificate (FSc Pre-Engineering / ICS)
export const SAMPLE_FSC_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
  <defs>
    <linearGradient id="fscBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFCFA"/>
      <stop offset="100%" stop-color="#EFF6F1"/>
    </linearGradient>
  </defs>

  <rect width="800" height="550" fill="url(#fscBg)"/>
  <rect x="22" y="22" width="756" height="506" fill="none" stroke="#12593A" stroke-width="6"/>
  <rect x="34" y="34" width="732" height="482" fill="none" stroke="#D4AF37" stroke-width="2"/>

  <!-- Header Banner -->
  <rect x="60" y="45" width="680" height="60" fill="#0C3F29" rx="8"/>
  <text x="400" y="78" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
    BOARD OF INTERMEDIATE &amp; SECONDARY EDUCATION, LAHORE
  </text>
  <text x="400" y="96" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FACC15" text-anchor="middle" letter-spacing="1.5">
    HIGHER SECONDARY SCHOOL CERTIFICATE (HSSC / INTERMEDIATE)
  </text>

  <text x="400" y="145" font-family="Georgia, serif" font-size="14" fill="#333333" text-anchor="middle">
    Provisional Certificate &amp; Transcript of Academic Record
  </text>

  <!-- Candidate Name -->
  <text x="400" y="185" font-family="Georgia, serif" font-size="24" font-weight="black" fill="#0C3F29" text-anchor="middle">
    MUHAMMAD BILAL TARIQ
  </text>
  <text x="400" y="210" font-family="Arial, sans-serif" font-size="12" fill="#555555" text-anchor="middle">
    Institution: <tspan font-weight="bold">Government College of Science, Wahdat Road Lahore</tspan>
  </text>
  <text x="400" y="230" font-family="Arial, sans-serif" font-size="12" fill="#555555" text-anchor="middle">
    Group: <tspan font-weight="bold" fill="#12593A">PRE-ENGINEERING (MATHEMATICS, PHYSICS, CHEMISTRY)</tspan>
  </text>

  <!-- Performance Badge Box -->
  <g transform="translate(150, 255)">
    <rect width="500" height="130" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" rx="10"/>
    
    <g transform="translate(40, 25)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">ROLL NUMBER</text>
      <text x="0" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="black" fill="#0F172A">672019</text>
    </g>

    <g transform="translate(180, 25)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">MARKS OBTAINED</text>
      <text x="0" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="black" fill="#12593A">896 / 1100</text>
    </g>

    <g transform="translate(340, 25)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">PERCENTAGE &amp; GRADE</text>
      <text x="0" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="black" fill="#D97706">81.4% (Grade A)</text>
    </g>

    <line x1="20" y1="70" x2="480" y2="70" stroke="#E2E8F0" stroke-width="1"/>

    <text x="250" y="100" font-family="Arial, sans-serif" font-size="12" fill="#334155" text-anchor="middle">
      ✓ Certified eligible for Pakistan Engineering Council (PEC) accredited Bachelor degrees.
    </text>
  </g>

  <!-- Verified Stamp Seal -->
  <g transform="translate(680, 440)">
    <circle cx="0" cy="0" r="34" fill="#0C3F29" opacity="0.1"/>
    <circle cx="0" cy="0" r="30" fill="none" stroke="#0C3F29" stroke-width="2"/>
    <text x="0" y="-6" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#0C3F29" text-anchor="middle">SEAL OF BOARD</text>
    <text x="0" y="6" font-family="Arial, sans-serif" font-size="9" font-weight="black" fill="#D97706" text-anchor="middle">PASSED 2023</text>
    <text x="0" y="16" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#0C3F29" text-anchor="middle">1ST DIVISION</text>
  </g>

  <!-- Signatures -->
  <line x1="120" y1="485" x2="260" y2="485" stroke="#64748B" stroke-width="1"/>
  <text x="190" y="502" font-family="Arial, sans-serif" font-size="10" fill="#64748B" text-anchor="middle">Verified by Principal</text>

  <line x1="370" y1="485" x2="510" y2="485" stroke="#64748B" stroke-width="1"/>
  <text x="440" y="502" font-family="Arial, sans-serif" font-size="10" fill="#64748B" text-anchor="middle">Controller of Examinations</text>
</svg>
`)}`;

// 3. NAVTTC Government of Pakistan National Vocational Certificate (NVQF Level 4)
export const SAMPLE_NAVTTC_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
  <defs>
    <linearGradient id="navttcBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F9F4"/>
    </linearGradient>
  </defs>

  <rect width="800" height="550" fill="url(#navttcBg)"/>
  
  <!-- Outer Modern Green Border -->
  <rect x="25" y="25" width="750" height="500" fill="none" stroke="#0B4228" stroke-width="8" rx="12"/>
  <rect x="36" y="36" width="728" height="478" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="8,4"/>

  <!-- NAVTTC Green Header Ribbon -->
  <g transform="translate(400, 75)" text-anchor="middle">
    <!-- Pakistan Flag Green Star & Crescent -->
    <circle cx="-135" cy="-2" r="16" fill="#0B4228"/>
    <path d="M-137,-9 A9,9 0 1,0 -127,2 A7.5,7.5 0 1,1 -137,-9 Z" fill="#FFFFFF"/>
    <polygon points="-131,-6 -130,-3 -127,-3 -129,-1 -128,2 -131,0 -133,2 -133,-1 -135,-3 -132,-3" fill="#FFFFFF"/>

    <text x="15" y="-10" font-family="Arial, sans-serif" font-size="14" font-weight="black" fill="#0B4228" letter-spacing="1">
      GOVERNMENT OF PAKISTAN
    </text>
    <text x="15" y="10" font-family="Georgia, serif" font-size="17" font-weight="bold" fill="#047857">
      National Vocational &amp; Technical Training Commission (NAVTTC)
    </text>
    <text x="15" y="26" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#6B7280" letter-spacing="2">
      PRIME MINISTER'S YOUTH SKILLS DEVELOPMENT PROGRAM
    </text>
  </g>

  <line x1="80" y1="125" x2="720" y2="125" stroke="#0B4228" stroke-width="2"/>

  <!-- Certificate Subhead -->
  <text x="400" y="160" font-family="Georgia, serif" font-size="14" font-style="italic" fill="#374151" text-anchor="middle">
    National Vocational Qualifications Framework (NVQF Level 4)
  </text>
  <text x="400" y="185" font-family="Georgia, serif" font-size="13" fill="#4B5563" text-anchor="middle">
    This Competency Credential is proudly awarded to:
  </text>

  <!-- Recipient -->
  <text x="400" y="222" font-family="Georgia, serif" font-size="26" font-weight="black" fill="#0B4228" text-anchor="middle">
    MUHAMMAD BILAL TARIQ
  </text>

  <text x="400" y="250" font-family="Georgia, serif" font-size="13" fill="#374151" text-anchor="middle">
    who has successfully completed the rigorous competency-based training in:
  </text>

  <!-- Course Badge -->
  <g transform="translate(100, 270)">
    <rect width="600" height="52" fill="#0B4228" rx="8"/>
    <text x="300" y="32" font-family="Arial, sans-serif" font-size="17" font-weight="black" fill="#FCD34D" text-anchor="middle" letter-spacing="0.5">
      UI / UX DESIGN, FIGMA &amp; FREELANCING
    </text>
  </g>

  <!-- Competencies Checklist -->
  <g transform="translate(100, 340)">
    <rect width="600" height="85" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" rx="8"/>
    <text x="20" y="24" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0B4228">
      CORE COMPETENCIES VERIFIED:
    </text>
    <text x="20" y="46" font-family="Arial, sans-serif" font-size="10.5" fill="#374151">
      • User Journey Mapping &amp; Information Architecture &nbsp;&nbsp;&nbsp; • Figma Component Systems &amp; Wireframing
    </text>
    <text x="20" y="66" font-family="Arial, sans-serif" font-size="10.5" fill="#374151">
      • Mobile App Prototyping &amp; Design Systems &nbsp;&nbsp;&nbsp; • Upwork &amp; Client Communication Portfolio
    </text>
  </g>

  <!-- QR Code & Verification Block -->
  <g transform="translate(100, 445)">
    <!-- Simulated QR Code -->
    <rect width="45" height="45" fill="#0B4228" rx="4"/>
    <rect x="5" y="5" width="15" height="15" fill="#FFFFFF"/>
    <rect x="8" y="8" width="9" height="9" fill="#0B4228"/>
    <rect x="25" y="5" width="15" height="15" fill="#FFFFFF"/>
    <rect x="28" y="8" width="9" height="9" fill="#0B4228"/>
    <rect x="5" y="25" width="15" height="15" fill="#FFFFFF"/>
    <rect x="8" y="28" width="9" height="9" fill="#0B4228"/>

    <text x="56" y="18" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0B4228">
      Credential ID: NVQF-4-UIUX-2024-9981
    </text>
    <text x="56" y="34" font-family="Arial, sans-serif" font-size="9" fill="#6B7280">
      National Recognition: Recognized across Pakistan IT Industry &amp; TEVTA
    </text>
  </g>

  <!-- Signatures -->
  <line x1="560" y1="480" x2="700" y2="480" stroke="#4B5563" stroke-width="1"/>
  <text x="630" y="498" font-family="Arial, sans-serif" font-size="10" fill="#4B5563" text-anchor="middle">
    Executive Director, NAVTTC
  </text>
</svg>
`)}`;

// 4. Muhammad Bilal - Software Developer CV & Portfolio Card Graphic
export const SAMPLE_CV_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
  <defs>
    <linearGradient id="cvBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EEF2F6"/>
    </linearGradient>
  </defs>

  <rect width="800" height="550" fill="url(#cvBg)"/>
  <rect x="20" y="20" width="760" height="510" fill="#FFFFFF" rx="12" stroke="#E2E8F0" stroke-width="2"/>

  <!-- Left Sidebar (Navy/Green Accent) -->
  <rect x="20" y="20" width="240" height="510" fill="#0B4228" rx="12"/>
  <rect x="240" y="20" width="20" height="510" fill="#0B4228"/>

  <!-- Avatar Placeholder -->
  <g transform="translate(140, 90)">
    <circle cx="0" cy="0" r="42" fill="#FCD34D"/>
    <text x="0" y="10" font-family="Arial, sans-serif" font-size="28" font-weight="black" fill="#0B4228" text-anchor="middle">MB</text>
  </g>

  <!-- Left Sidebar Info -->
  <text x="140" y="160" font-family="Arial, sans-serif" font-size="15" font-weight="black" fill="#FFFFFF" text-anchor="middle">
    MUHAMMAD BILAL
  </text>
  <text x="140" y="178" font-family="Arial, sans-serif" font-size="10.5" fill="#A7F3D0" text-anchor="middle">
    BS Computer Science Student
  </text>

  <!-- Sidebar Skills List -->
  <g transform="translate(45, 215)" fill="#FFFFFF">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FCD34D">VERIFIED SKILLS</text>
    <text x="0" y="22" font-family="Arial, sans-serif" font-size="10">• Python &amp; Data Analysis</text>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="10">• JavaScript / React.js</text>
    <text x="0" y="58" font-family="Arial, sans-serif" font-size="10">• Git &amp; GitHub Version Control</text>
    <text x="0" y="76" font-family="Arial, sans-serif" font-size="10">• SQL &amp; Relational Databases</text>
    <text x="0" y="94" font-family="Arial, sans-serif" font-size="10">• Linux Terminal &amp; Bash</text>

    <text x="0" y="130" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FCD34D">ONLINE PROFILES</text>
    <text x="0" y="152" font-family="Arial, sans-serif" font-size="9.5">github.com/bilal-dev</text>
    <text x="0" y="170" font-family="Arial, sans-serif" font-size="9.5">linkedin.com/in/bilal-cs</text>
    <text x="0" y="188" font-family="Arial, sans-serif" font-size="9.5">bilal-portfolio.dev</text>
  </g>

  <!-- Main CV Body Content -->
  <g transform="translate(290, 60)">
    <!-- Header -->
    <text x="0" y="20" font-family="Arial, sans-serif" font-size="22" font-weight="black" fill="#0F172A">CURRICULUM VITAE</text>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Junior Full Stack &amp; DevOps Aspirant | Lahore, Pakistan</text>
    <line x1="0" y1="52" x2="460" y2="52" stroke="#E2E8F0" stroke-width="2"/>

    <!-- Education Section -->
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0B4228">ACADEMIC BACKGROUND</text>
    <text x="0" y="102" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1E293B">BS Computer Science (In Progress)</text>
    <text x="0" y="118" font-family="Arial, sans-serif" font-size="10" fill="#64748B">FAST-NUCES Lahore • 2022 – Present (CGPA 3.4)</text>

    <text x="0" y="142" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1E293B">Higher Secondary Certificate (FSc Pre-Engineering)</text>
    <text x="0" y="158" font-family="Arial, sans-serif" font-size="10" fill="#64748B">Government College of Science Lahore • 81.4% Marks</text>

    <!-- Projects Section -->
    <text x="0" y="196" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0B4228">PORTFOLIO PROJECTS</text>
    <text x="0" y="218" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1E293B">1. Cloud Server Deployment Automation</text>
    <text x="0" y="234" font-family="Arial, sans-serif" font-size="10" fill="#475569">Automated Docker microservices deployment using GitHub Actions and Linux scripts.</text>

    <text x="0" y="260" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1E293B">2. Pakistani Student Career Portal</text>
    <text x="0" y="276" font-family="Arial, sans-serif" font-size="10" fill="#475569">React.js web app connecting Matric/FSc students to subsidized NAVTTC technical programs.</text>

    <!-- Certifications -->
    <text x="0" y="316" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0B4228">LICENSES &amp; CERTIFICATIONS</text>
    <text x="0" y="338" font-family="Arial, sans-serif" font-size="10.5" fill="#1E293B">• NAVTTC National Vocational Certificate (Level 4)</text>
    <text x="0" y="354" font-family="Arial, sans-serif" font-size="10.5" fill="#1E293B">• Meta Front-End Developer Specialization (Coursera)</text>

    <!-- Bottom Verification Callout -->
    <rect x="0" y="380" width="460" height="45" fill="#ECFDF5" stroke="#A7F3D0" rx="8"/>
    <text x="15" y="407" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#065F46">
      ✓ Verified Proof of Work: Live code available at github.com/bilal-dev
    </text>
  </g>
</svg>
`)}`;
