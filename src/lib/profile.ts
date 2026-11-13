// Profile data for Snigdha Datta's portfolio.
// Sourced from her resume and GitHub profile (github.com/SnigdhaDatta).

export const profile = {
  name: "Snigdha Datta",
  role: "Backend Developer",
  location: "Kolkata, India",
  email: "snigdha04datta@gmail.com",
  phone: "+91 8617253230",
  tagline: "Backend developer diving deep into DevOps & System Design",
  bio: "I build event-driven backends and full-stack products with Node.js, Kafka, Redis and AWS — currently on a training arc through DevOps and System Design.",
};

export const links = {
  github: "https://github.com/SnigdhaDatta",
  linkedin: "https://linkedin.com/in/snigdhadatta",
  leetcode: "https://leetcode.com/u/snigdha04datta",
  twitter: "https://x.com/Snigdha_Datta7",
  email: "mailto:snigdha04datta@gmail.com",
  phone: "tel:+918617253230",
};

export const stats = [
  { value: "200+", label: "DSA problems solved on LeetCode" },
  { value: "8.72", label: "CGPA — B.Tech CSE, JIS University" },
  { value: "20", label: "Public repositories on GitHub" },
  { value: "30+", label: "Users on Kineq, my live product" },
];

export type Project = {
  chapter: string;
  title: string;
  jp: string;
  summary: string;
  points: string[];
  tech: string[];
  live?: string;
  code?: string;
  badge?: string;
  ongoing?: boolean;
};

export const projects: Project[] = [
  {
    chapter: "01",
    title: "CandleFlow",
    jp: "リアルタイム",
    ongoing: true,
    summary:
      "Distributed real-time crypto streaming engine — live Binance trades become OHLC candlesticks, streamed to clients in milliseconds.",
    points: [
      "Event-driven microservices ingest live crypto trade streams with Apache Kafka",
      "REST APIs, WebSocket streaming and a CLI client for real-time + historical market data",
      "TimescaleDB for time-series storage, Redis caching and Docker for high-throughput ingestion",
    ],
    tech: ["Node.js", "Hono.js", "Kafka", "Redis", "TimescaleDB", "Docker"],
    code: "https://github.com/SnigdhaDatta/Real-Time-Trade-Streaming-Engine",
  },
  {
    chapter: "02",
    title: "Kineq",
    jp: "ウォッチリスト",
    ongoing: true,
    summary:
      "Full-stack AI-powered watchlist organizer — track shows across Ongoing, Watchlist and Completed, with an AI recommender chatbot and shareable lists.",
    points: [
      "28 RESTful routes with JWT authentication and custom folders per list",
      "AI Recommender chatbot plus list sharing across social platforms",
      "Deployed on AWS EC2 with Nginx + HTTPS; Redis caching cut API response times",
    ],
    tech: ["Next.js", "Node.js", "Express.js", "MongoDB", "Redis", "AWS"],
    live: "https://kin-eq.snowpie.me/",
    code: "https://github.com/SnigdhaDatta/Kineq",
    badge: "30+ users",
  },
  {
    chapter: "03",
    title: "Vocabulex",
    jp: "辞書アプリ",
    summary:
      "Minimal dictionary app with real-time search results, synonyms and audio pronunciation.",
    points: [
      "Real-time search-as-you-type against a dictionary REST API",
      "Audio pronunciation playback and synonym exploration",
      "Fully responsive, deployed on Vercel",
    ],
    tech: ["React", "REST APIs", "Vercel"],
    live: "https://vocabulex.vercel.app/",
    code: "https://github.com/SnigdhaDatta/Vocabulex",
  },
  {
    chapter: "04",
    title: "Trinex",
    jp: "スキャナー",
    summary:
      "Modern web app for advanced website scanning — domain verification, script analysis, credential leak checks and SEO scoring.",
    points: [
      "Puppeteer + Chromium browser automation for deep site scans",
      "Scan history management with Clerk authentication",
      "Prisma for database management on a Next.js + TypeScript stack",
    ],
    tech: ["Next.js", "TypeScript", "Puppeteer", "Prisma", "Clerk"],
    code: "https://github.com/SnigdhaDatta/trinex",
  },
];

export const skillGroups = [
  { name: "Languages", jp: "言語", items: ["C++", "JavaScript", "TypeScript", "Java (Basic)"] },
  { name: "Frontend", jp: "フロント", items: ["React.js", "Next.js", "Tailwind CSS"] },
  {
    name: "Backend",
    jp: "バックエンド",
    items: ["Node.js", "Express.js", "Hono.js", "RESTful APIs", "JWT", "Kafka"],
  },
  { name: "Databases", jp: "データベース", items: ["MongoDB", "MySQL", "TimescaleDB", "Redis"] },
  {
    name: "Cloud & DevOps",
    jp: "クラウド",
    items: ["AWS EC2", "GCP (basics)", "Docker", "Nginx", "GitHub Actions"],
  },
  {
    name: "Concepts",
    jp: "基礎",
    items: [
      "Microservices",
      "System Design",
      "Data Structures & Algorithms",
      "DBMS",
      "CORS",
      "JWT Auth",
    ],
  },
];

export const timeline = [
  {
    period: "2024 — 2025",
    arc: "The Mentor Arc",
    logo: "google",
    title: "Cloud Facilitator — Google Developer Group",
    detail: "Conducted 8+ Google Cloud workshops for 200+ students and mentored 60+ learners.",
  },
  {
    period: "2024 — 2025",
    arc: "The Writer Arc",
    logo: "geeksforgeeks",
    title: "Technical Content Writer — GeeksforGeeks",
    detail: "Authored technical articles on Cloud SQL and MySQL that gathered 20K+ views.",
  },
];

export const achievements = [
  { title: "Smart India Hackathon", detail: "2nd Runner-up — Internal Round" },
  { title: "200+ DSA Problems", detail: "Solved on LeetCode, medium level and up" },
  {
    title: "Google Cloud Skill Badges",
    detail: "Earned multiple badges through repeated Study Jams",
  },
];

export const publications = [
  {
    title: "How to Create a MySQL Database with Cloud SQL on Google Cloud Platform",
    venue: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/devops/how-to-create-a-mysql-database-with-cloud-sql-on-google-cloud-platform/",
  },
  {
    title: "Understanding 10 JavaScript Array Methods as a Beginner",
    venue: "Hashnode",
    url: "https://snigdhadatta.hashnode.dev/understanding-10-javascript-array-methods-as-a-beginner-with-manoj-the-farmer",
  },
];

export type OpenSourcePR = {
  title: string;
  repo: string;
  href: string;
  status: "Ongoing" | "Merged" | "Closed";
};

// Real pull requests Snigdha opened or merged on repositories she does not own.
export const openSource: OpenSourcePR[] = [
  {
    title: "feat(web): persist bookmark sort order",
    repo: "karakeep-app/karakeep",
    href: "https://github.com/karakeep-app/karakeep/pull/3256",
    status: "Ongoing",
  },
  {
    title: "License information updation",
    repo: "Alienimnida/scanner",
    href: "https://github.com/Alienimnida/scanner/pull/5",
    status: "Merged",
  },
  {
    title: "Create assignment1",
    repo: "team-devbyte/webdev",
    href: "https://github.com/team-devbyte/webdev/pull/1",
    status: "Closed",
  },
];

export const community = [
  {
    role: "Core Team Member — Google Developer Group",
    detail: "Organized technical events and workshops for 100+ students.",
  },
  {
    role: "Volunteer — HexaFalls Hackathon",
    detail: "Coordinated onboarding for 200+ participants.",
  },
];
