export interface SkillResource {
  name: string;
  url: string;
  provider: string;
  /** Government / public-sector verified source */
  official: boolean;
  note: string;
}

export interface SkillStep {
  title: string;
  detail: string;
}

export interface SkillDetail {
  slug: string;
  name: string;
  icon: string;
  level: string;
  description: string;
  overview: string;
  whyItMatters: string;
  timeToLearn: string;
  practice: string[];
  steps: SkillStep[];
  careers: string[];
  resources: SkillResource[];
}

/** Government / public-sector platforms reused across skills. */
const GOV = {
  swayam: {
    name: "SWAYAM Free Online Courses",
    url: "https://swayam.gov.in/",
    provider: "Ministry of Education, Govt. of India",
    official: true,
  },
  nptel: {
    name: "NPTEL Video Courses",
    url: "https://nptel.ac.in/",
    provider: "IITs & IISc (Govt. funded)",
    official: true,
  },
  skillIndia: {
    name: "Skill India Digital Hub",
    url: "https://www.skillindiadigital.gov.in/",
    provider: "Ministry of Skill Development & Entrepreneurship",
    official: true,
  },
  ncs: {
    name: "National Career Service",
    url: "https://www.ncs.gov.in/",
    provider: "Ministry of Labour & Employment",
    official: true,
  },
  digitalIndia: {
    name: "Digital India / PMGDISHA Literacy",
    url: "https://www.pmgdisha.in/",
    provider: "Govt. of India",
    official: true,
  },
} as const;

export const skillDetails: SkillDetail[] = [
  {
    slug: "communication-skills",
    name: "Communication Skills",
    icon: "MessageSquare",
    level: "Foundational",
    description: "Express ideas clearly in speech and writing.",
    overview:
      "Communication is the ability to get an idea from your head into someone else's head with the least friction — through speech, writing, body language and listening. Every interview, group discussion, viva, email and team meeting is graded on it.",
    whyItMatters:
      "Recruiters in India consistently rank communication as the #1 employability gap. Two candidates with identical marks are separated by how clearly they explain their work.",
    timeToLearn: "8–12 weeks of daily 30-minute practice for a visible jump.",
    practice: [
      "Record a 2-minute answer to 'Tell me about yourself' daily and rewatch it.",
      "Write one 150-word summary of a news article every day.",
      "Join a college debate, MUN or Toastmasters-style club.",
      "Read English/regional newspaper editorials aloud for pronunciation and pace.",
    ],
    steps: [
      { title: "Fix the fundamentals", detail: "Grammar, vocabulary and sentence structure. 20 new words a week, used in sentences." },
      { title: "Learn to listen", detail: "Practise paraphrasing what others said before you reply. Most 'communication problems' are listening problems." },
      { title: "Structure your speaking", detail: "Use frameworks: Point → Reason → Example → Point. Apply it in every GD and interview." },
      { title: "Write professionally", detail: "Emails, resumes, reports. Short sentences, one idea per paragraph, clear subject lines." },
      { title: "Perform under pressure", detail: "Mock interviews, group discussions, and presenting to strangers." },
    ],
    careers: ["Any corporate role", "Sales & Marketing", "Teaching", "Civil Services", "HR", "Journalism"],
    resources: [
      { ...GOV.swayam, note: "Search 'Soft Skills' and 'Effective Business Communication' — free certified courses from Indian universities." },
      { ...GOV.nptel, note: "'Developing Soft Skills and Personality' by IIT Kanpur is the most popular free course here." },
      { ...GOV.skillIndia, note: "Free communication and employability modules with government-recognised certificates." },
      { name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", provider: "BBC (public broadcaster)", official: true, note: "Free daily audio, grammar and pronunciation lessons." },
      { name: "British Council LearnEnglish", url: "https://learnenglish.britishcouncil.org/", provider: "British Council", official: true, note: "Free levelled listening, speaking and writing practice." },
    ],
  },
  {
    slug: "leadership",
    name: "Leadership",
    icon: "Users",
    level: "Advanced",
    description: "Inspire and guide teams towards shared goals.",
    overview:
      "Leadership is taking responsibility for an outcome that depends on other people. It is decision-making, delegation, conflict handling and keeping a group motivated when things go wrong.",
    whyItMatters:
      "Promotions past your first 3–4 years depend almost entirely on leadership, not technical skill. It is also what admissions panels and scholarship committees look for.",
    timeToLearn: "Built over years — but you can start leading a small team this month.",
    practice: [
      "Volunteer to lead one college fest committee or class project.",
      "Run a weekly 15-minute stand-up with your project group.",
      "Give and ask for feedback after every group task.",
      "Mentor a junior student for one semester.",
    ],
    steps: [
      { title: "Lead yourself first", detail: "Time management, reliability, keeping commitments. Nobody follows someone who misses deadlines." },
      { title: "Take a small ownership role", detail: "Club secretary, project lead, event coordinator — any role with real accountability." },
      { title: "Learn delegation", detail: "Match tasks to strengths, set clear deadlines, follow up without micromanaging." },
      { title: "Handle conflict", detail: "Practise difficult conversations: separate the person from the problem." },
      { title: "Build and communicate vision", detail: "Explain why the work matters, not just what to do." },
    ],
    careers: ["Management", "Civil Services", "Entrepreneurship", "Project Management", "Defence Services", "NGO leadership"],
    resources: [
      { ...GOV.swayam, note: "Look for 'Leadership and Team Effectiveness' and IIM-authored management courses." },
      { ...GOV.nptel, note: "'Leadership and Team Effectiveness' (IIT Kharagpur) — free with optional paid certificate exam." },
      { name: "Nehru Yuva Kendra Sangathan", url: "https://nyks.nic.in/", provider: "Ministry of Youth Affairs & Sports", official: true, note: "Youth leadership programmes and volunteering at district level." },
      { ...GOV.skillIndia, note: "Supervisory and team-management modules under recognised job roles." },
    ],
  },
  {
    slug: "coding",
    name: "Coding",
    icon: "Code",
    level: "Career-defining",
    description: "Build software, automate tasks, ship products.",
    overview:
      "Coding is instructing a computer to solve a problem. Start with one language (Python is the friendliest), learn how data is stored and moved, then build real projects that other people can use.",
    whyItMatters:
      "Software roles remain among the highest paying entry-level jobs in India, and coding is now expected in data, finance, research and even government analytics roles.",
    timeToLearn: "3–6 months to job-ready basics with 1–2 focused hours a day.",
    practice: [
      "Solve 2 problems a day on a practice site for 90 days.",
      "Build 3 portfolio projects and publish the code publicly.",
      "Rebuild a website or app you use daily, in simplified form.",
      "Contribute one fix to an open-source project.",
    ],
    steps: [
      { title: "Pick one language", detail: "Python or C. Finish its full syntax before touching anything else." },
      { title: "Data structures & algorithms", detail: "Arrays, strings, hashing, trees, graphs, sorting, recursion — the core of every interview." },
      { title: "Build projects", detail: "A to-do app, then a database-backed web app, then something with an API." },
      { title: "Learn the tools", detail: "Git, GitHub, the command line, debugging, reading documentation." },
      { title: "Specialise", detail: "Web, mobile, data science, AI/ML, embedded systems or cybersecurity." },
    ],
    careers: ["Software Engineer", "Data Scientist", "AI/ML Engineer", "Cybersecurity Analyst", "Product Engineer"],
    resources: [
      { ...GOV.nptel, note: "'Programming in Python', 'Programming and Data Structures using C' — flagship free IIT courses." },
      { ...GOV.swayam, note: "Credit-transferable programming courses from IITs, IGNOU and central universities." },
      { name: "NPTEL+ / Spoken Tutorial (IIT Bombay)", url: "https://spoken-tutorial.org/", provider: "IIT Bombay, MoE funded", official: true, note: "Free step-by-step software training in Indian languages, with free certificates." },
      { name: "FutureSkills Prime", url: "https://futureskillsprime.in/", provider: "MeitY + NASSCOM", official: true, note: "Government-backed digital skilling in AI, cloud, cybersecurity with fee reimbursement." },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/", provider: "freeCodeCamp.org (non-profit)", official: false, note: "Free full curriculum with certifications, entirely hands-on." },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/", provider: "Mozilla Foundation", official: false, note: "The reference for web development — HTML, CSS, JavaScript." },
    ],
  },
  {
    slug: "public-speaking",
    name: "Public Speaking",
    icon: "Mic",
    level: "High-impact",
    description: "Command an audience with confidence.",
    overview:
      "Public speaking is structured communication to a group. The fear is normal — it reduces only through repeated, deliberate exposure with feedback.",
    whyItMatters:
      "Seminars, viva, placements, GDs, client demos and interviews are all public speaking in disguise. It multiplies the value of everything else you know.",
    timeToLearn: "6–10 weeks of weekly speaking slots to lose most stage fear.",
    practice: [
      "Speak for 2 minutes on a random topic, every day, on camera.",
      "Volunteer to present in every class seminar.",
      "Time your speeches — respect the limit exactly.",
      "Watch your recordings for filler words ('um', 'basically') and cut them.",
    ],
    steps: [
      { title: "Prepare a structure", detail: "Hook → 3 points → close with a call to action. Never memorise word-for-word." },
      { title: "Control your voice", detail: "Pace, pauses and volume. Pauses are the single fastest upgrade." },
      { title: "Fix body language", detail: "Feet planted, open hands, eye contact across three zones of the room." },
      { title: "Handle Q&A", detail: "Repeat the question, answer in one sentence, then expand." },
      { title: "Speak often", detail: "Debates, elocution, college fests, YouTube — volume of reps beats theory." },
    ],
    careers: ["Teaching & Training", "Law", "Politics & Civil Services", "Sales", "Anchoring & Media"],
    resources: [
      { ...GOV.swayam, note: "'Speaking Effectively' and presentation-skills courses from Indian universities, free to audit." },
      { ...GOV.nptel, note: "IIT soft-skills courses include dedicated modules on presentation and public speaking." },
      { name: "TED Talks", url: "https://www.ted.com/talks", provider: "TED (non-profit)", official: false, note: "Study structure and delivery of the world's best short talks." },
      { name: "British Council LearnEnglish", url: "https://learnenglish.britishcouncil.org/", provider: "British Council", official: true, note: "Pronunciation and presentation practice material, free." },
    ],
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    icon: "Rocket",
    level: "Career-defining",
    description: "Spot opportunities and build ventures.",
    overview:
      "Entrepreneurship is finding a real problem people will pay to solve, building the smallest possible solution, and improving it with feedback until it becomes a business.",
    whyItMatters:
      "India's startup ecosystem is the world's third largest, with government funding, incubation and tax benefits available to student founders.",
    timeToLearn: "Launch a tiny first venture within 3 months; mastery is lifelong.",
    practice: [
      "Interview 20 potential customers before writing any code or spending money.",
      "Sell something small — services, a product, a workshop — and get real payment.",
      "Build a one-page business model canvas for any idea you have.",
      "Join your college's E-Cell or an Atal Incubation Centre programme.",
    ],
    steps: [
      { title: "Find a real problem", detail: "Talk to people. Problems you personally face are the easiest to validate." },
      { title: "Test cheaply", detail: "Landing page, WhatsApp group, manual service — prove demand before building." },
      { title: "Understand unit economics", detail: "Cost per customer, price, margin, break-even. Numbers before ambition." },
      { title: "Register and comply", detail: "Company/LLP registration, GST, Startup India recognition, IP basics." },
      { title: "Fund and scale", detail: "Bootstrapping, government grants, incubators, angel investment." },
    ],
    careers: ["Founder", "Product Manager", "Business Analyst", "Family business", "Social entrepreneur"],
    resources: [
      { name: "Startup India", url: "https://www.startupindia.gov.in/", provider: "DPIIT, Govt. of India", official: true, note: "Free learning programme, startup recognition, tax benefits and funding schemes." },
      { name: "Atal Innovation Mission", url: "https://aim.gov.in/", provider: "NITI Aayog, Govt. of India", official: true, note: "Atal Tinkering Labs and Incubation Centres for student innovators." },
      { name: "MSME / Udyam Registration", url: "https://udyamregistration.gov.in/", provider: "Ministry of MSME", official: true, note: "Register your venture free and unlock MSME schemes and subsidies." },
      { ...GOV.swayam, note: "'Entrepreneurship Essentials' and IIM/IIT entrepreneurship courses, free to learn." },
      { name: "NIESBUD", url: "https://niesbud.nic.in/", provider: "Ministry of Skill Development & Entrepreneurship", official: true, note: "National institute running entrepreneurship development programmes." },
    ],
  },
  {
    slug: "financial-literacy",
    name: "Financial Literacy",
    icon: "Wallet",
    level: "Foundational",
    description: "Manage money, invest and plan wealth.",
    overview:
      "Financial literacy is knowing how to earn, budget, save, invest, borrow safely and protect yourself from fraud. It is the skill that decides what your salary actually becomes.",
    whyItMatters:
      "A student who starts a SIP at 21 instead of 31 can end up with several times more wealth for the same monthly amount, purely from compounding.",
    timeToLearn: "4–6 weeks for the basics; then a lifelong habit.",
    practice: [
      "Track every rupee you spend for 30 days.",
      "Build a 50-30-20 budget and stick to it for a semester.",
      "Open a demat account and start a ₹500 SIP to learn by doing.",
      "Read your bank and mutual fund statements line by line.",
    ],
    steps: [
      { title: "Budget and track", detail: "Income, fixed costs, variable costs, savings. Awareness comes before optimisation." },
      { title: "Emergency fund", detail: "3–6 months of expenses in a liquid savings instrument before any investing." },
      { title: "Learn instruments", detail: "FD, PPF, mutual funds, index funds, stocks, NPS, insurance — risk vs return." },
      { title: "Understand taxes", detail: "Income tax slabs, TDS, 80C deductions, filing your own ITR." },
      { title: "Avoid traps", detail: "Credit-card interest, personal loans, ponzi and 'guaranteed return' scams." },
    ],
    careers: ["Chartered Accountancy", "Banking", "Investment Analysis", "Financial Planning", "Any role — personally essential"],
    resources: [
      { name: "RBI Financial Education", url: "https://www.rbi.org.in/financialeducation/home.aspx", provider: "Reserve Bank of India", official: true, note: "Official, free financial literacy material in many Indian languages." },
      { name: "SEBI Investor Education (Saa₹thi)", url: "https://investor.sebi.gov.in/", provider: "SEBI", official: true, note: "The regulator's own investor education portal — markets, mutual funds, fraud alerts." },
      { name: "NCFE Financial Education", url: "https://www.ncfe.org.in/", provider: "National Centre for Financial Education", official: true, note: "Free courses and the NFLAT exam for school and college students." },
      { name: "Income Tax Department", url: "https://www.incometax.gov.in/", provider: "Govt. of India", official: true, note: "File your ITR and read official guides on tax saving." },
      { ...GOV.swayam, note: "Personal finance and investment courses from Indian universities, free." },
    ],
  },
  {
    slug: "critical-thinking",
    name: "Critical Thinking",
    icon: "Brain",
    level: "Foundational",
    description: "Analyse problems and form sound judgement.",
    overview:
      "Critical thinking is evaluating information before believing it: checking sources, spotting bias and faulty logic, weighing evidence and reaching a defensible conclusion.",
    whyItMatters:
      "Aptitude tests, UPSC, CAT, case interviews and research all test reasoning far more than memory. It is also your defence against misinformation.",
    timeToLearn: "Continuous — noticeable improvement in 8–12 weeks of daily reasoning practice.",
    practice: [
      "Solve logical reasoning and data interpretation sets daily.",
      "For any strong claim you read, find the primary source.",
      "Argue the opposite side of an opinion you hold, in writing.",
      "Keep a decision journal: reasoning first, outcome later.",
    ],
    steps: [
      { title: "Question the source", detail: "Who says this, what evidence, what do they gain if you believe it?" },
      { title: "Learn logical fallacies", detail: "Straw man, false cause, appeal to authority, survivorship bias." },
      { title: "Read data properly", detail: "Averages vs medians, sample size, correlation vs causation, misleading graphs." },
      { title: "Structure problems", detail: "Break big questions into mutually exclusive parts before solving." },
      { title: "Decide and review", detail: "Make a call, write your reasoning, revisit it after the result." },
    ],
    careers: ["Research", "Civil Services", "Consulting", "Law", "Data Analysis", "Medicine"],
    resources: [
      { ...GOV.nptel, note: "'Introduction to Logic', 'Problem Solving through Programming' and reasoning courses from IITs." },
      { ...GOV.swayam, note: "Free logic, research methodology and analytical reasoning courses." },
      { name: "PIB Fact Check", url: "https://factcheck.pib.gov.in/", provider: "Press Information Bureau, Govt. of India", official: true, note: "Official fact-checking of viral claims — good daily reasoning practice." },
      { name: "National Digital Library of India", url: "https://ndl.iitkgp.ac.in/", provider: "IIT Kharagpur / Ministry of Education", official: true, note: "Free access to millions of verified academic resources." },
    ],
  },
  {
    slug: "career-readiness",
    name: "Career Readiness",
    icon: "BriefcaseBusiness",
    level: "Essential",
    description: "Resume, interview and workplace skills.",
    overview:
      "Career readiness is everything between 'qualified' and 'hired': a resume that passes screening, an interview performance that converts, and the professional habits that keep you growing after joining.",
    whyItMatters:
      "Most students lose offers not for lack of knowledge but for a weak resume, unprepared interviews and no proof of work.",
    timeToLearn: "4–8 weeks of focused preparation before your placement season.",
    practice: [
      "Rewrite your resume to one page with measurable achievements.",
      "Do 10 mock interviews — record and review each one.",
      "Build a portfolio or project page you can send as a link.",
      "Register on the National Career Service and apply to 5 roles weekly.",
    ],
    steps: [
      { title: "Build proof of work", detail: "Projects, internships, certifications, volunteering — evidence beats claims." },
      { title: "Craft the resume", detail: "One page, action verbs, numbers, tailored to each job description." },
      { title: "Master the interview", detail: "STAR answers for behavioural questions, clear technical explanations." },
      { title: "Professional presence", detail: "LinkedIn profile, professional email, punctuality, email etiquette." },
      { title: "Negotiate and grow", detail: "Understand CTC structure, ask questions, plan your first-year learning." },
    ],
    careers: ["Every career — this is the bridge between study and job"],
    resources: [
      { ...GOV.ncs, note: "Government job portal with free career counselling, resume help and skill training." },
      { ...GOV.skillIndia, note: "Free employability courses with NSQF-aligned government certificates." },
      { name: "Rozgar Mela / Employment Exchanges", url: "https://www.ncs.gov.in/job-seeker/Pages/Job-Fairs.aspx", provider: "Ministry of Labour & Employment", official: true, note: "Official job fairs and employment exchange registration." },
      { ...GOV.digitalIndia, note: "Basic digital literacy certification, useful for rural and first-generation learners." },
      { ...GOV.swayam, note: "'Employability Skills' and campus-to-corporate courses, free with optional certification." },
    ],
  },
];

export function getSkillBySlug(slug: string): SkillDetail | undefined {
  return skillDetails.find((s) => s.slug === slug);
}

export function skillSlugFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
