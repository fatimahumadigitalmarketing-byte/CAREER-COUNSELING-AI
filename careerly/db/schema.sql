-- =====================================================
-- Careerly AI - PostgreSQL & pgvector Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Embedding dimension configuration constant: 384 (multilingual-MiniLM-L12-v2)
-- Education stages (Matric, FSc / Intermediate, University, Vocational / Graduate)
CREATE TABLE IF NOT EXISTS education_stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Educational and Vocational Institutions across Pakistan
CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'public_university', 'private_university', 'navttc_institute', 'tebta_center'
    recognized_by VARCHAR(100) NOT NULL, -- e.g., 'HEC', 'NAVTTC', 'TEVTA', 'PEC', 'PMDC'
    website VARCHAR(255),
    source_url TEXT NOT NULL,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Programs: Academic Degrees, Diplomas, and NAVTTC Vocational Courses
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('navttc_course', 'degree', 'diploma')),
    sector VARCHAR(100) NOT NULL, -- e.g., 'Information Technology', 'Healthcare', 'Engineering', 'Commerce', 'Vocational Trades'
    nvqf_level INTEGER, -- National Vocational Qualifications Framework Level (1-6), NULL for academic degrees
    duration_months INTEGER NOT NULL,
    fee NUMERIC(10, 2) DEFAULT 0.00, -- 0 for government funded / free NAVTTC programs
    stipend NUMERIC(10, 2) DEFAULT 0.00, -- monthly stipend if offered by NAVTTC/Kamyab Jawan
    entry_requirement VARCHAR(255) NOT NULL, -- e.g., 'Matric (Science/Arts)', 'FSc Pre-Engineering', 'Graduation'
    outline_text TEXT NOT NULL,
    source_url TEXT NOT NULL,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Program Offerings in specific institutes and cities
CREATE TABLE IF NOT EXISTS program_offerings (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    institution_id INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    intake_dates VARCHAR(150) NOT NULL, -- e.g., 'Spring / Fall', 'March & September intakes'
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'upcoming'))
);

-- Eligibility Rules for hard checks
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    min_education VARCHAR(100) NOT NULL, -- e.g., 'Matric', 'Intermediate', 'Bachelors'
    required_stream VARCHAR(100), -- e.g., 'Pre-Medical', 'Pre-Engineering', 'ICS', 'Commerce', 'Any'
    required_subjects TEXT, -- JSON string or comma-separated list: 'Biology,Chemistry,Physics' or 'Mathematics'
    notes TEXT
);

-- Career Opportunities
CREATE TABLE IF NOT EXISTS careers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    typical_entry_path TEXT NOT NULL,
    approx_salary_note VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Skills Dictionary
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- Junction Tables
CREATE TABLE IF NOT EXISTS program_skills (
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (program_id, skill_id)
);

CREATE TABLE IF NOT EXISTS career_skills (
    career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE IF NOT EXISTS program_careers (
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    career_id INTEGER NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    PRIMARY KEY (program_id, career_id)
);

-- Program Chunks for vector retrieval (384-dimensional multilingual embeddings)
CREATE TABLE IF NOT EXISTS program_chunks (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding vector(384)
);

-- HNSW Vector Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_program_chunks_embedding 
ON program_chunks USING hnsw (embedding vector_cosine_ops);

-- =====================================================
-- SEED DATA: 10 SAMPLE NAVTTC-STYLE COURSES & 5 CAREERS
-- (All clearly labeled SAMPLE as required)
-- =====================================================

-- Education Stages
INSERT INTO education_stages (name) VALUES
    ('Matric'),
    ('FSc / Intermediate / A-Levels'),
    ('University Undergraduate'),
    ('Graduates & Skills Training')
ON CONFLICT (name) DO NOTHING;

-- Sample Institutions
INSERT INTO institutions (id, name, city, province, type, recognized_by, website, source_url, last_verified_date) VALUES
    (1, '[SAMPLE] National Institute of Technology & Skills Islamabad', 'Islamabad', 'ICT', 'navttc_institute', 'NAVTTC', 'https://navttc.gov.pk', 'https://navttc.gov.pk/sample-institutes', '2026-03-01'),
    (2, '[SAMPLE] Government College of Technology Lahore', 'Lahore', 'Punjab', 'tebta_center', 'TEVTA / NAVTTC', 'https://tevta.gop.pk', 'https://tevta.gop.pk/sample-centers', '2026-03-01'),
    (3, '[SAMPLE] Karachi Vocational Training Centre', 'Karachi', 'Sindh', 'navttc_institute', 'NAVTTC', 'https://navttc.gov.pk', 'https://navttc.gov.pk/sample-institutes', '2026-03-01'),
    (4, '[SAMPLE] Peshawar Technical Training Centre', 'Peshawar', 'KPK', 'navttc_institute', 'NAVTTC', 'https://navttc.gov.pk', 'https://navttc.gov.pk/sample-institutes', '2026-03-01'),
    (5, '[SAMPLE] Quetta Institute of Emerging Sciences', 'Quetta', 'Balochistan', 'navttc_institute', 'NAVTTC', 'https://navttc.gov.pk', 'https://navttc.gov.pk/sample-institutes', '2026-03-01')
ON CONFLICT (id) DO NOTHING;

-- 10 Sample NAVTTC / Academic Programs
INSERT INTO programs (id, name, type, sector, nvqf_level, duration_months, fee, stipend, entry_requirement, outline_text, source_url, last_verified_date) VALUES
    (1, '[SAMPLE] NAVTTC Cloud Computing & DevOps Practitioner', 'navttc_course', 'Information Technology', 4, 6, 0.00, 3000.00, 'Intermediate (FSc/ICS/FA) or Matric with Computer Science', 'Hands-on curriculum covering Linux OS fundamentals, AWS Cloud architecture, Docker containerization, Kubernetes basics, CI/CD pipeline deployment, and infrastructure monitoring.', 'https://navttc.gov.pk/sample-courses/cloud-computing', '2026-03-01'),
    (2, '[SAMPLE] NAVTTC Full Stack Web Development (MERN)', 'navttc_course', 'Information Technology', 4, 6, 0.00, 3000.00, 'Matric or Intermediate (Any stream)', 'Comprehensive training in modern frontend and backend development: HTML5, modern CSS, JavaScript ES6+, React.js UI, Node.js, Express server APIs, MongoDB database design, and Git version control.', 'https://navttc.gov.pk/sample-courses/full-stack-web', '2026-03-01'),
    (3, '[SAMPLE] NAVTTC Python Programming & Artificial Intelligence Basics', 'navttc_course', 'Information Technology', 4, 6, 0.00, 3000.00, 'Intermediate (Pre-Engineering/ICS) or Matric Science', 'Python core syntax, data structures, NumPy and Pandas data wrangling, scikit-learn machine learning fundamentals, prompt engineering, and ethical AI development practices.', 'https://navttc.gov.pk/sample-courses/python-ai', '2026-03-01'),
    (4, '[SAMPLE] NAVTTC Graphic Design, UI/UX & Freelancing', 'navttc_course', 'Creative Arts & Media', 3, 3, 0.00, 2500.00, 'Matric (Any stream)', 'Visual design theory, typography, Figma interface design, Adobe Illustrator branding, Adobe Photoshop compositing, portfolio creation, and client freelancing on Upwork and Fiverr.', 'https://navttc.gov.pk/sample-courses/graphic-design', '2026-03-01'),
    (5, '[SAMPLE] NAVTTC Solar Photovoltaic Installation & Maintenance Technician', 'navttc_course', 'Renewable Energy', 3, 3, 0.00, 2500.00, 'Matric (Science preferred)', 'Solar PV cell physics, inverter installation, rooftop panel mounting, charge controller configuration, battery storage systems, safety protocols, and troubleshooting residential solar arrays.', 'https://navttc.gov.pk/sample-courses/solar-technician', '2026-03-01'),
    (6, '[SAMPLE] NAVTTC Mobile App Development with Flutter', 'navttc_course', 'Information Technology', 4, 6, 0.00, 3000.00, 'Intermediate (ICS/FSc/FA) or Matric with basic coding', 'Dart language essentials, Flutter widget tree, responsive cross-platform UI, state management (Provider/Bloc), Firebase integration, REST API consumption, and Google Play Store publishing.', 'https://navttc.gov.pk/sample-courses/flutter-apps', '2026-03-01'),
    (7, '[SAMPLE] NAVTTC Digital Marketing, SEO & E-Commerce', 'navttc_course', 'Business & Commerce', 3, 3, 0.00, 2500.00, 'Matric (Any stream)', 'Search Engine Optimization (SEO), Google Ads search campaigns, Meta/Instagram social ads, content strategy, Shopify and Daraz store management, analytics, and freelance agency setup.', 'https://navttc.gov.pk/sample-courses/digital-marketing', '2026-03-01'),
    (8, '[SAMPLE] NAVTTC Industrial Electrician & PLC Automation', 'navttc_course', 'Manufacturing & Engineering', 3, 6, 0.00, 3000.00, 'Matric (Science/Technical stream)', 'Industrial wiring standards, motor control circuits, relays and contactors, Programmable Logic Controller (PLC) ladder logic, sensor interfacing, and workplace occupational safety.', 'https://navttc.gov.pk/sample-courses/industrial-electrician', '2026-03-01'),
    (9, '[SAMPLE] NAVTTC Cybersecurity Analyst & Network Defense', 'navttc_course', 'Information Technology', 4, 6, 0.00, 3000.00, 'Intermediate (ICS / Pre-Engineering preferred)', 'Networking protocols (TCP/IP), Kali Linux tools, network packet analysis with Wireshark, vulnerability scanning, firewalls and IDS/IPS, security operations fundamentals, and ethical hacking basics.', 'https://navttc.gov.pk/sample-courses/cybersecurity', '2026-03-01'),
    (10, '[SAMPLE] NAVTTC Clinical Assistant & Healthcare Support', 'navttc_course', 'Healthcare', 3, 6, 0.00, 2500.00, 'Matric (Biology / Science)', 'Patient vital signs measurement, basic emergency first aid, medical hygiene and sterilisation, patient records management, and outpatient clinic operational assistance.', 'https://navttc.gov.pk/sample-courses/clinical-support', '2026-03-01')
ON CONFLICT (id) DO NOTHING;

-- Sample Offerings
INSERT INTO program_offerings (program_id, institution_id, city, intake_dates, status) VALUES
    (1, 1, 'Islamabad', 'March & September', 'open'),
    (2, 2, 'Lahore', 'February & August', 'open'),
    (2, 3, 'Karachi', 'March & September', 'open'),
    (3, 1, 'Islamabad', 'March & September', 'open'),
    (4, 2, 'Lahore', 'Quarterly (Jan, Apr, Jul, Oct)', 'open'),
    (4, 3, 'Karachi', 'Quarterly (Jan, Apr, Jul, Oct)', 'open'),
    (5, 4, 'Peshawar', 'March & August', 'open'),
    (5, 5, 'Quetta', 'March & August', 'open'),
    (6, 2, 'Lahore', 'April & October', 'open'),
    (7, 3, 'Karachi', 'Rolling admissions', 'open'),
    (8, 2, 'Lahore', 'March & September', 'open'),
    (9, 1, 'Islamabad', 'April & October', 'open'),
    (10, 4, 'Peshawar', 'March & September', 'open')
ON CONFLICT DO NOTHING;

-- Sample Eligibility Rules (Hard rule definitions)
INSERT INTO eligibility_rules (program_id, min_education, required_stream, required_subjects, notes) VALUES
    (1, 'Intermediate', 'Any', 'None', '[SAMPLE] Prefers ICS or FSc Pre-Engineering; basic computer literacy required.'),
    (2, 'Matric', 'Any', 'None', '[SAMPLE] Open to Matric pass from Science or Arts stream with basic English literacy.'),
    (3, 'Intermediate', 'ICS/Pre-Engineering', 'Mathematics', '[SAMPLE] Requires high school math or computer science background.'),
    (4, 'Matric', 'Any', 'None', '[SAMPLE] No prior design experience required; artistic or creative interest beneficial.'),
    (5, 'Matric', 'Science', 'Physics', '[SAMPLE] Matric with Science preferred for electrical principles comprehension.'),
    (6, 'Intermediate', 'Any', 'None', '[SAMPLE] Basic programming interest recommended.'),
    (7, 'Matric', 'Any', 'None', '[SAMPLE] Basic English and smartphone/computer literacy needed.'),
    (8, 'Matric', 'Science', 'Physics', '[SAMPLE] Requires foundational physics and technical aptitude.'),
    (9, 'Intermediate', 'ICS/Pre-Engineering', 'Computer Science,Mathematics', '[SAMPLE] Intermediate background in computing or sciences required.'),
    (10, 'Matric', 'Science', 'Biology', '[SAMPLE] Requires Matric Science with Biology.')
ON CONFLICT DO NOTHING;

-- 5 Sample Careers
INSERT INTO careers (id, name, description, typical_entry_path, approx_salary_note, source_url, last_verified_date) VALUES
    (1, '[SAMPLE] Cloud Support Associate / DevOps Trainee', 'Maintains cloud infrastructure, assists in deploying applications on AWS/GCP, configures servers, and troubleshoots deployment scripts.', 'NAVTTC Cloud Computing course or BS Computer Science + AWS Cloud Practitioner certification', 'High industry demand across domestic software houses and overseas remote contracts. Earnings depend on skill depth; no guaranteed figures.', 'https://navttc.gov.pk/sample-careers/cloud', '2026-03-01'),
    (2, '[SAMPLE] Junior Frontend / Web Developer', 'Builds user-friendly websites, single page applications, responsive layouts, and integrates backend REST APIs for local and international clients.', 'NAVTTC Web Development diploma or BS SE/CS + personal GitHub portfolio projects', 'Extensive local and remote market demand for developers with public portfolio code. Hiring is merit-based; no absolute guarantees.', 'https://navttc.gov.pk/sample-careers/web-dev', '2026-03-01'),
    (3, '[SAMPLE] UI/UX Designer & Digital Illustrator', 'Designs mobile and web app screens, prototypes user flows in Figma, and crafts visual brand identities for startups and e-commerce stores.', 'NAVTTC Graphic Design course + Behance/Dribbble portfolio showcasing 3-5 complete case studies', 'Strong remote freelance viability on international platforms. Clients evaluate visual design portfolios rather than formal degrees.', 'https://navttc.gov.pk/sample-careers/ui-ux', '2026-03-01'),
    (4, '[SAMPLE] Renewable Energy / Solar System Technician', 'Surveys residential and commercial rooftops, calculates inverter and load specifications, mounts PV panels, and conducts routine electrical maintenance.', 'NAVTTC Solar PV Technician certificate + 3 months apprenticeship with solar EPC contractor', 'Widespread adoption across residential, commercial, and agricultural installations. Strong technical trade outlook.', 'https://navttc.gov.pk/sample-careers/solar-tech', '2026-03-01'),
    (5, '[SAMPLE] Digital Marketing & E-Commerce Executive', 'Runs social media ad campaigns, manages product listings on Daraz and Shopify, optimizes website SEO, and handles customer inquiries.', 'NAVTTC Digital Marketing certificate + hands-on experience running Meta Ads or Daraz seller shop', 'Consistent demand in retail stores, D2C brands, and digital agencies. Performance is driven by campaign results.', 'https://navttc.gov.pk/sample-careers/digital-marketing', '2026-03-01')
ON CONFLICT (id) DO NOTHING;

-- Skills
INSERT INTO skills (id, name) VALUES
    (1, 'Linux'), (2, 'AWS Cloud'), (3, 'Docker'), (4, 'React.js'), (5, 'JavaScript'),
    (6, 'Node.js'), (7, 'Python'), (8, 'Machine Learning'), (9, 'Figma'), (10, 'Graphic Design'),
    (11, 'Solar PV Installation'), (12, 'Electrical Safety'), (13, 'Flutter'), (14, 'SEO'),
    (15, 'Meta Ads'), (16, 'PLC Programming'), (17, 'Cybersecurity'), (18, 'Patient Care')
ON CONFLICT (id) DO NOTHING;

-- Link Program Skills
INSERT INTO program_skills (program_id, skill_id) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 4), (2, 5), (2, 6),
    (3, 7), (3, 8),
    (4, 9), (4, 10),
    (5, 11), (5, 12),
    (6, 5), (6, 13),
    (7, 14), (7, 15),
    (8, 12), (8, 16),
    (9, 1), (9, 17),
    (10, 18)
ON CONFLICT DO NOTHING;

-- Link Career Skills
INSERT INTO career_skills (career_id, skill_id) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 4), (2, 5), (2, 6),
    (3, 9), (3, 10),
    (4, 11), (4, 12),
    (5, 14), (5, 15)
ON CONFLICT DO NOTHING;

-- Link Program Careers
INSERT INTO program_careers (program_id, career_id) VALUES
    (1, 1),
    (2, 2),
    (4, 3),
    (5, 4),
    (7, 5)
ON CONFLICT DO NOTHING;
