export type StreamSlug =
  | "mpc" | "bipc" | "cec" | "mec" | "arts";

export interface Stream {
  slug: StreamSlug;
  code: string;
  name: string;
  tagline: string;
  description: string;
  subjects: string[];
  skills: string[];
  courses: string[];
  careers: string[];
  higherEducation: string[];
  salary: string;
  futureScope: string;
  businessOpps: string[];
  govtJobs: string[];
  gradient: string;
}

export const streams: Stream[] = [
  {
    slug: "mpc",
    code: "MPC",
    name: "Mathematics, Physics, Chemistry",
    tagline: "The launchpad for engineers, scientists & innovators",
    description: "MPC opens doors to engineering, technology, research and emerging fields like AI, robotics and space tech.",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "Computer Science (optional)"],
    skills: ["Logical reasoning", "Problem solving", "Analytical thinking", "Programming basics", "Mathematical modeling"],
    courses: ["B.Tech / B.E.", "B.Sc. (Hons.)", "Integrated M.Tech", "B.Arch", "BCA"],
    careers: ["Engineering", "Software Development", "Artificial Intelligence", "Data Science", "Robotics", "Space Technology", "Defence Careers", "Entrepreneurship"],
    higherEducation: ["M.Tech / M.S.", "MBA", "PhD in Sciences", "Research fellowships (CSIR, DRDO, ISRO)"],
    salary: "₹4 LPA – ₹40 LPA depending on specialization and experience",
    futureScope: "AI, quantum computing, EV, semiconductor and space industries are projected to grow 20%+ annually.",
    businessOpps: ["EdTech startups", "SaaS products", "Robotics & IoT ventures", "AI consulting"],
    govtJobs: ["ISRO Scientist", "DRDO", "BARC", "Indian Engineering Services (IES)", "Defence (NDA, technical entry)"],
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    slug: "bipc",
    code: "BiPC",
    name: "Biology, Physics, Chemistry",
    tagline: "Heal, discover and shape the future of life sciences",
    description: "BiPC is the gateway to medicine, biotech, pharmacy and healthcare innovation.",
    subjects: ["Biology / Botany & Zoology", "Physics", "Chemistry", "English"],
    skills: ["Observation", "Empathy", "Research mindset", "Lab techniques", "Critical thinking"],
    courses: ["MBBS", "BDS", "B.Pharm", "B.Sc. Biotech / Nursing / Physio", "B.V.Sc"],
    careers: ["Medicine", "Dentistry", "Pharmacy", "Biotechnology", "Physiotherapy", "Nutrition", "Nursing", "Medical Research"],
    higherEducation: ["MD / MS", "M.Pharm", "M.Sc. (Genetics, Microbiology)", "PhD"],
    salary: "₹5 LPA – ₹35 LPA; specialists & surgeons earn significantly higher",
    futureScope: "Healthcare, genomics and biotech are booming post-pandemic with strong global demand.",
    businessOpps: ["Clinics & diagnostic labs", "HealthTech startups", "Wellness brands", "Pharma manufacturing"],
    govtJobs: ["AIIMS / Govt. Hospitals", "ICMR Scientist", "Public Health Officer", "Drug Inspector", "Defence Medical Services"],
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    slug: "cec",
    code: "CEC",
    name: "Civics, Economics, Commerce",
    tagline: "Build businesses, lead organizations, shape policy",
    description: "CEC builds the foundation for careers in finance, law, business and civil services.",
    subjects: ["Civics", "Economics", "Commerce", "English"],
    skills: ["Communication", "Analytical reasoning", "Numerical aptitude", "Business acumen"],
    courses: ["B.Com (Hons.)", "BBA", "CA Foundation", "BA LL.B", "BMS"],
    careers: ["Chartered Accountancy", "Banking", "Finance", "Business Management", "Law", "Government Jobs", "Entrepreneurship"],
    higherEducation: ["MBA", "M.Com", "LL.M", "CA / CS / CMA"],
    salary: "₹4 LPA – ₹50 LPA; CAs and MBAs from top schools earn premium",
    futureScope: "FinTech, ESG, compliance and consulting are reshaping commerce careers.",
    businessOpps: ["Trading & retail", "Consulting firms", "FinTech apps", "Legal practice"],
    govtJobs: ["UPSC Civil Services", "RBI Grade B", "SEBI", "SSC CGL", "Banking PO"],
    gradient: "from-amber-500 to-orange-400",
  },
  {
    slug: "mec",
    code: "MEC",
    name: "Mathematics, Economics, Commerce",
    tagline: "Numbers, markets and modern finance",
    description: "MEC blends quantitative skills with commerce — ideal for analytics, finance and FinTech.",
    subjects: ["Mathematics", "Economics", "Commerce", "English"],
    skills: ["Quantitative reasoning", "Data interpretation", "Financial modeling", "Excel & analytics tools"],
    courses: ["B.Com (Hons.)", "B.A. Economics", "BBA Finance", "B.Sc. Statistics", "CA / CFA path"],
    careers: ["Finance", "Banking", "Investment Analysis", "Data Analytics", "FinTech", "Chartered Accountancy", "Business Intelligence"],
    higherEducation: ["MBA Finance", "M.A. Economics", "CFA", "MSc Data Analytics"],
    salary: "₹5 LPA – ₹45 LPA; analysts & investment bankers earn top tier",
    futureScope: "Data-driven finance, algorithmic trading and FinTech are the fastest growing verticals.",
    businessOpps: ["Wealth management", "FinTech apps", "Analytics consulting", "Stock advisory"],
    govtJobs: ["RBI", "SEBI", "Indian Economic Service", "Banking PO", "NABARD"],
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    slug: "arts",
    code: "Arts",
    name: "Arts & Humanities",
    tagline: "Shape society, culture and human understanding",
    description: "Arts opens diverse paths from civil services and law to journalism, psychology and global affairs.",
    subjects: ["History", "Political Science", "Psychology", "Sociology", "Languages"],
    skills: ["Writing", "Critical thinking", "Empathy", "Public speaking", "Research"],
    courses: ["BA (Hons.)", "BA LL.B", "BJMC", "BA Psychology", "BA International Relations"],
    careers: ["Civil Services", "Journalism", "Psychology", "Law", "Public Administration", "Political Science", "International Relations", "Social Work", "Media and Communication"],
    higherEducation: ["MA", "LL.M", "MSW", "MPhil / PhD"],
    salary: "₹3 LPA – ₹30 LPA; civil servants and senior journalists earn significantly more",
    futureScope: "Content economy, mental health, policy and diplomacy careers are expanding globally.",
    businessOpps: ["Media houses", "Counseling practice", "NGOs", "Content & creator businesses"],
    govtJobs: ["IAS / IPS / IFS", "State PSC", "Foreign Service", "Information Service"],
    gradient: "from-rose-500 to-pink-400",
  },
];

export interface Career {
  slug: string;
  title: string;
  category: string;
  overview: string;
  eligibility: string;
  skills: string[];
  courses: string[];
  roadmap: string[];
  salary: string;
  futureDemand: string;
  growth: string;
  icon: string;
}

export const careers: Career[] = [
  { slug: "software-engineer", title: "Software Engineer", category: "Technology", icon: "Code2",
    overview: "Designs, builds and maintains software products used by millions worldwide.",
    eligibility: "12th (MPC) → B.Tech / BCA / B.Sc. CS",
    skills: ["DSA", "System design", "Web/Mobile dev", "Cloud", "Git"],
    courses: ["B.Tech CSE", "BCA", "Full-stack bootcamps"],
    roadmap: ["12th MPC", "B.Tech / BCA", "Internships", "Junior Dev → Senior → Architect"],
    salary: "₹6 – 60 LPA", futureDemand: "Extremely high — top hiring sector globally.",
    growth: "Move into Tech Lead, Engineering Manager, CTO or build your own startup." },
  { slug: "ai-engineer", title: "AI Engineer", category: "Technology", icon: "Brain",
    overview: "Builds intelligent systems using machine learning, deep learning and LLMs.",
    eligibility: "B.Tech / B.Sc. with strong math and programming",
    skills: ["Python", "ML/DL", "Math & Stats", "MLOps", "LLMs"],
    courses: ["B.Tech AI/ML", "M.Tech AI", "Online ML specializations"],
    roadmap: ["MPC + coding", "B.Tech/B.Sc.", "ML projects", "ML Engineer → AI Architect"],
    salary: "₹8 – 80 LPA", futureDemand: "Fastest-growing role of this decade.",
    growth: "AI Architect, Research Scientist, AI Product Lead." },
  { slug: "data-scientist", title: "Data Scientist", category: "Technology", icon: "BarChart3",
    overview: "Extracts insights from data to drive business and product decisions.",
    eligibility: "Any quantitative degree + analytics skills",
    skills: ["Python/R", "SQL", "Statistics", "ML", "Storytelling"],
    courses: ["B.Sc. Stats", "B.Tech", "MSc Data Science"],
    roadmap: ["Strong math", "Analytics internships", "Data Analyst → Data Scientist → Lead"],
    salary: "₹6 – 50 LPA", futureDemand: "Very high across every industry.",
    growth: "Head of Data, Chief Data Officer." },
  { slug: "cyber-security-expert", title: "Cyber Security Expert", category: "Technology", icon: "Shield",
    overview: "Protects systems, networks and data from digital attacks.",
    eligibility: "B.Tech CSE / IT or certifications",
    skills: ["Networking", "Ethical hacking", "Cryptography", "SIEM tools"],
    courses: ["B.Tech CSE", "CEH", "OSCP", "CISSP"],
    roadmap: ["Coding + networking", "Certifications", "SOC Analyst → Pentester → CISO"],
    salary: "₹5 – 55 LPA", futureDemand: "Critical — shortage of 3M+ professionals globally.",
    growth: "CISO, Security Architect, independent consultant." },
  { slug: "doctor", title: "Doctor", category: "Healthcare", icon: "Stethoscope",
    overview: "Diagnoses and treats illnesses; cornerstone of healthcare.",
    eligibility: "12th BiPC + NEET → MBBS",
    skills: ["Clinical reasoning", "Empathy", "Decision-making", "Stamina"],
    courses: ["MBBS", "MD / MS", "Super-specialization"],
    roadmap: ["BiPC", "NEET", "MBBS (5.5y)", "PG → Specialist → Consultant"],
    salary: "₹6 – 50 LPA+", futureDemand: "Always essential and recession-proof.",
    growth: "Specialist, Hospital Director, Researcher." },
  { slug: "dentist", title: "Dentist", category: "Healthcare", icon: "Smile",
    overview: "Specialist in oral health, dental surgery and cosmetic dentistry.",
    eligibility: "12th BiPC + NEET → BDS",
    skills: ["Precision", "Patient communication", "Manual dexterity"],
    courses: ["BDS", "MDS"], roadmap: ["BiPC", "NEET", "BDS", "MDS / Practice"],
    salary: "₹4 – 25 LPA", futureDemand: "Strong, growing cosmetic dentistry market.",
    growth: "Own clinic, specialist practice, dental chains." },
  { slug: "pharmacist", title: "Pharmacist", category: "Healthcare", icon: "Pill",
    overview: "Expert in medicines, formulation and patient drug counseling.",
    eligibility: "12th BiPC/MPC → B.Pharm / D.Pharm",
    skills: ["Pharmacology", "Attention to detail", "Communication"],
    courses: ["D.Pharm", "B.Pharm", "Pharm.D"],
    roadmap: ["BiPC", "B.Pharm", "Hospital/Industry/Retail"],
    salary: "₹3 – 15 LPA", futureDemand: "Steady; growing in clinical research.",
    growth: "Pharma R&D, regulatory affairs, own pharmacy." },
  { slug: "biotechnologist", title: "Biotechnologist", category: "Healthcare", icon: "FlaskConical",
    overview: "Uses biology and tech to develop products in healthcare, agri and environment.",
    eligibility: "12th BiPC → B.Sc./B.Tech Biotech",
    skills: ["Lab techniques", "Research", "Data analysis"],
    courses: ["B.Tech Biotech", "M.Sc. Biotech", "PhD"],
    roadmap: ["BiPC", "Biotech degree", "Research / Industry"],
    salary: "₹3 – 20 LPA", futureDemand: "Booming with genomics and CRISPR.",
    growth: "Research scientist, biotech entrepreneur." },
  { slug: "chartered-accountant", title: "Chartered Accountant", category: "Finance", icon: "Calculator",
    overview: "Expert in audit, tax, finance and compliance — trusted business advisor.",
    eligibility: "12th any stream → CA Foundation",
    skills: ["Accounting", "Tax laws", "Audit", "Analytical skills"],
    courses: ["CA Foundation → Inter → Final"],
    roadmap: ["12th", "CA Foundation", "Articleship", "CA → Partner / CFO"],
    salary: "₹7 – 60 LPA", futureDemand: "Always in demand across industries.",
    growth: "CFO, Partner in Big 4, own practice." },
  { slug: "lawyer", title: "Lawyer", category: "Law & Governance", icon: "Scale",
    overview: "Advises clients, drafts contracts and represents in court.",
    eligibility: "12th any stream → BA LL.B / LL.B",
    skills: ["Argumentation", "Research", "Drafting", "Ethics"],
    courses: ["BA LL.B (5y)", "LL.B (3y)", "LL.M"],
    roadmap: ["12th", "CLAT", "Law degree", "Litigation / Corporate / Judiciary"],
    salary: "₹5 – 50 LPA+", futureDemand: "Strong; corporate & cyber law growing.",
    growth: "Senior counsel, partner, judge." },
  { slug: "ias-officer", title: "IAS Officer", category: "Civil Services", icon: "Landmark",
    overview: "Top administrative officer driving policy and governance in India.",
    eligibility: "Graduation in any discipline → UPSC CSE",
    skills: ["Leadership", "Public policy", "Communication", "Integrity"],
    courses: ["Any Bachelors", "UPSC coaching"],
    roadmap: ["Graduation", "UPSC Prelims → Mains → Interview", "Training at LBSNAA"],
    salary: "₹56K – ₹2.5L/month + perks", futureDemand: "Prestigious; highly competitive.",
    growth: "DM → Secretary → Cabinet Secretary." },
  { slug: "ips-officer", title: "IPS Officer", category: "Civil Services", icon: "ShieldCheck",
    overview: "Leads police forces and internal security operations.",
    eligibility: "Graduation → UPSC CSE",
    skills: ["Discipline", "Leadership", "Crisis management"],
    courses: ["Any Bachelors", "UPSC"],
    roadmap: ["Graduation", "UPSC", "Training at SVPNPA"],
    salary: "₹56K – ₹2.5L/month + perks", futureDemand: "Stable and prestigious.",
    growth: "SP → DGP → Director CBI/IB." },
  { slug: "financial-analyst", title: "Financial Analyst", category: "Finance", icon: "TrendingUp",
    overview: "Analyses investments, markets and financial data to guide decisions.",
    eligibility: "B.Com / BBA / MBA / CFA",
    skills: ["Excel", "Valuation", "Financial modeling", "Markets"],
    courses: ["B.Com", "MBA Finance", "CFA"],
    roadmap: ["Commerce", "Finance degree", "Analyst → VP → MD"],
    salary: "₹6 – 40 LPA", futureDemand: "Very strong across banking & FinTech.",
    growth: "Portfolio manager, hedge fund, CFO." },
  { slug: "economist", title: "Economist", category: "Finance", icon: "LineChart",
    overview: "Studies economic data to inform policy, business and research.",
    eligibility: "BA/MA Economics, often PhD",
    skills: ["Econometrics", "Research", "Modeling"],
    courses: ["BA Eco", "MA Eco", "PhD"],
    roadmap: ["Eco degree", "Research / Govt / Corporate"],
    salary: "₹6 – 35 LPA", futureDemand: "Growing in policy & data roles.",
    growth: "Chief Economist, advisor to governments." },
  { slug: "journalist", title: "Journalist", category: "Media", icon: "Newspaper",
    overview: "Investigates and reports news that shapes public understanding.",
    eligibility: "BJMC / BA Journalism",
    skills: ["Writing", "Interviewing", "Research", "Ethics"],
    courses: ["BJMC", "MA Journalism"],
    roadmap: ["Journalism degree", "Internships", "Reporter → Editor"],
    salary: "₹3 – 25 LPA", futureDemand: "Digital media booming.",
    growth: "Editor-in-chief, anchor, independent creator." },
  { slug: "psychologist", title: "Psychologist", category: "Healthcare", icon: "HeartPulse",
    overview: "Helps individuals understand and improve mental health and behavior.",
    eligibility: "BA/B.Sc. Psychology → MA + RCI license",
    skills: ["Empathy", "Listening", "Research", "Diagnosis"],
    courses: ["BA Psy", "MA Clinical Psy", "M.Phil RCI"],
    roadmap: ["Psy degree", "MA + licensure", "Practice / Research"],
    salary: "₹3 – 25 LPA", futureDemand: "Rising fast post-pandemic.",
    growth: "Own practice, clinical lead, researcher." },
  { slug: "entrepreneur", title: "Entrepreneur", category: "Business", icon: "Rocket",
    overview: "Builds new businesses and creates value from ideas.",
    eligibility: "No formal eligibility; mindset and skill matter most",
    skills: ["Vision", "Execution", "Sales", "Leadership", "Resilience"],
    courses: ["BBA", "MBA (optional)", "Founder programs"],
    roadmap: ["Skill building", "Side projects", "Validate idea", "Build → Scale → Exit"],
    salary: "Unbounded", futureDemand: "India is the 3rd-largest startup ecosystem.",
    growth: "Serial founder, investor, mentor." },
  { slug: "digital-marketer", title: "Digital Marketer", category: "Business", icon: "Megaphone",
    overview: "Drives brand growth via SEO, ads, content and social media.",
    eligibility: "Any graduation + digital marketing skills",
    skills: ["SEO", "Performance ads", "Content", "Analytics"],
    courses: ["BBA", "Digital marketing certifications"],
    roadmap: ["Learn tools", "Internship", "Executive → Manager → CMO"],
    salary: "₹4 – 35 LPA", futureDemand: "Every business needs digital.",
    growth: "CMO, growth lead, agency founder." },
  { slug: "business-analyst", title: "Business Analyst", category: "Business", icon: "Briefcase",
    overview: "Bridges business needs and tech solutions using data.",
    eligibility: "B.Com/BBA/B.Tech + analytics",
    skills: ["SQL", "Excel", "Requirements gathering", "Communication"],
    courses: ["BBA", "MBA", "BA certifications"],
    roadmap: ["Degree", "Internship", "BA → Senior BA → Product Manager"],
    salary: "₹5 – 30 LPA", futureDemand: "Consistently strong.",
    growth: "Product Manager, Consulting Partner." },
  { slug: "research-scientist", title: "Research Scientist", category: "Science", icon: "Atom",
    overview: "Pushes the frontier of knowledge in their chosen field.",
    eligibility: "M.Sc./M.Tech + PhD",
    skills: ["Research methodology", "Critical thinking", "Writing", "Lab"],
    courses: ["B.Sc.", "M.Sc.", "PhD"],
    roadmap: ["Strong fundamentals", "Masters", "PhD", "Postdoc → Scientist"],
    salary: "₹6 – 40 LPA", futureDemand: "Growing R&D investment.",
    growth: "Principal Scientist, Lab Director." },
];

export interface Scholarship {
  name: string; level: string; amount: string; eligibility: string; provider: string;
}
export const scholarships: Scholarship[] = [
  { name: "NSP Pre-Matric", level: "Class 10", amount: "₹4,000–₹10,000/yr", eligibility: "Minority / SC / ST students", provider: "Govt. of India" },
  { name: "NSP Post-Matric", level: "Intermediate", amount: "₹10,000–₹20,000/yr", eligibility: "SC/ST/OBC, family income < ₹2.5L", provider: "Govt. of India" },
  { name: "INSPIRE Scholarship", level: "Degree", amount: "₹80,000/yr", eligibility: "Top 1% in 12th, pursuing B.Sc.", provider: "DST, Govt. of India" },
  { name: "Kishore Vaigyanik Protsahan Yojana", level: "Degree", amount: "₹5,000–₹7,000/mo", eligibility: "Science aspirants", provider: "IISc" },
  { name: "PM Scholarship Scheme", level: "Degree", amount: "₹2,500/mo", eligibility: "Wards of ex-servicemen", provider: "Ministry of Defence" },
  { name: "Reliance Foundation Scholarship", level: "Degree/PG", amount: "Up to ₹6L", eligibility: "Merit + need", provider: "Reliance Foundation" },
  { name: "Tata Scholarship (Cornell)", level: "Undergrad Abroad", amount: "Full tuition", eligibility: "Indian students admitted to Cornell", provider: "Tata Trusts" },
  { name: "Aditya Birla Scholarship", level: "PG", amount: "₹1.75L/yr", eligibility: "Top performers at IIT/IIM/NLSIU", provider: "Aditya Birla Group" },
];

export interface Skill {
  name: string; icon: string; description: string; level: string;
}
export const skillsList: Skill[] = [
  { name: "Communication Skills", icon: "MessageSquare", description: "Express ideas clearly in speech and writing.", level: "Foundational" },
  { name: "Leadership", icon: "Users", description: "Inspire and guide teams towards shared goals.", level: "Advanced" },
  { name: "Coding", icon: "Code", description: "Build software, automate tasks, ship products.", level: "Career-defining" },
  { name: "Public Speaking", icon: "Mic", description: "Command an audience with confidence.", level: "High-impact" },
  { name: "Entrepreneurship", icon: "Rocket", description: "Spot opportunities and build ventures.", level: "Career-defining" },
  { name: "Financial Literacy", icon: "Wallet", description: "Manage money, invest and plan wealth.", level: "Foundational" },
  { name: "Critical Thinking", icon: "Brain", description: "Analyse problems and form sound judgement.", level: "Foundational" },
  { name: "Career Readiness", icon: "BriefcaseBusiness", description: "Resume, interview and workplace skills.", level: "Essential" },
];

export interface College {
  name: string; type: string; location: string; rank: string; courses: string[];
}
export const colleges: College[] = [
  { name: "IIT Bombay", type: "Engineering", location: "Mumbai", rank: "#1 Engineering", courses: ["B.Tech", "M.Tech", "Dual Degree"] },
  { name: "IIT Delhi", type: "Engineering", location: "New Delhi", rank: "#2 Engineering", courses: ["B.Tech", "M.Tech"] },
  { name: "NIT Trichy", type: "Engineering", location: "Trichy", rank: "Top 10 NIT", courses: ["B.Tech", "M.Tech"] },
  { name: "BITS Pilani", type: "Engineering", location: "Pilani", rank: "Top Private", courses: ["B.E.", "M.Sc."] },
  { name: "AIIMS Delhi", type: "Medical", location: "New Delhi", rank: "#1 Medical", courses: ["MBBS", "MD", "MS"] },
  { name: "CMC Vellore", type: "Medical", location: "Vellore", rank: "Top 5 Medical", courses: ["MBBS", "BDS", "Nursing"] },
  { name: "JIPMER", type: "Medical", location: "Puducherry", rank: "Top 10 Medical", courses: ["MBBS", "MD"] },
  { name: "SRCC", type: "Commerce", location: "New Delhi", rank: "#1 Commerce", courses: ["B.Com (H)", "B.A. Eco (H)"] },
  { name: "St. Xavier's", type: "Arts", location: "Mumbai", rank: "Top Arts", courses: ["BA", "BMM", "B.Sc."] },
  { name: "NLSIU", type: "Law", location: "Bengaluru", rank: "#1 Law", courses: ["BA LL.B", "LL.M"] },
  { name: "IIM Ahmedabad", type: "Management", location: "Ahmedabad", rank: "#1 Management", courses: ["MBA", "PGPX"] },
  { name: "JNU", type: "Arts", location: "New Delhi", rank: "Top Humanities", courses: ["BA", "MA", "PhD"] },
];

export interface SuccessStory {
  name: string; role: string; story: string; stream: string;
}
export const successStories: SuccessStory[] = [
  { name: "Ananya Sharma", role: "AI Engineer @ Google", stream: "MPC → B.Tech CSE", story: "Started coding in Class 11. The quiz here helped me see AI was the perfect blend of my math + creativity strengths." },
  { name: "Rohan Iyer", role: "Cardiac Surgeon, AIIMS", stream: "BiPC → MBBS → MS", story: "Clarity on the medical roadmap from Class 10 helped me plan NEET prep and choose AIIMS." },
  { name: "Priya Menon", role: "Chartered Accountant", stream: "CEC → CA", story: "FuturePath's CA roadmap helped me crack Foundation in first attempt right after 12th." },
  { name: "Arjun Patel", role: "Founder, FinTech Startup", stream: "MEC → BBA → MBA", story: "The entrepreneurship section sparked the idea — today my startup serves 50K users." },
  { name: "Sneha Reddy", role: "IAS Officer", stream: "Arts → BA → UPSC", story: "Roadmap clarity and motivation kept me going through 3 years of UPSC prep." },
  { name: "Karthik Nair", role: "ISRO Scientist", stream: "MPC → B.Tech Aero", story: "Discovering space tech as a career changed my life direction in Class 11." },
];
