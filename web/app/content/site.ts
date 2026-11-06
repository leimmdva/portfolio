// Static site content. Later this comes from the API (GET /api/public/site) at build time.

export type SocialKind = "linkedin" | "github" | "instagram";

export interface Social {
  kind: SocialKind;
  label: string;
  handle: string;
  url: string;
}

export interface ProjectDetails {
  year: string;
  tagline: string;
  overview: string;
  built: string[];
  stack: string[];
  links: { label: string; url: string }[];
  linksNote?: string;
  results: { value: string; label: string }[];
  /** Shown in the detail dialog, in order. Paths under /projects, served by the site. */
  screenshots?: ProjectImage[];
}

export interface ProjectImage {
  url: string;
  alt: string;
}

export interface Project {
  slug: string;
  category: string;
  name: string;
  summary: string;
  highlight?: string;
  tags: string[];
  status?: string;
  cover?: { title: string; caption: string };
  /** Screenshot on the card. Without one the card shows the cover or a placeholder. */
  image?: ProjectImage;
  details?: ProjectDetails;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface SiteContent {
  name: string;
  email: string;
  cvUrl: string;
  availability: string;
  headline: { before: string; accent: string; after: string };
  lead: string;
  socials: Social[];
  facts: { value: string; label: string }[];
  projects: Project[];
  experience: TimelineItem[];
  skills: SkillGroup[];
  contact: { before: string; accent: string };
}

export const site: SiteContent = {
  name: "Leyla Mammadova",
  email: "info@leylammdva.com",
  cvUrl: "/Leyla-Mammadova-CV.pdf",
  availability: "Open to mid-level roles",
  headline: {
    before: "I build ",
    accent: "full-stack",
    after: " products, from retrieval AI to mobile apps.",
  },
  lead:
    "Math & Computer Science student at ESOGU, building full-stack web and mobile products — lately with a focus on retrieval-augmented AI and Flutter apps.",
  socials: [
    { kind: "linkedin", label: "LinkedIn", handle: "in/lmmmdva", url: "https://www.linkedin.com/in/lmmmdva" },
    { kind: "github", label: "GitHub", handle: "leimmdva", url: "https://github.com/leimmdva" },
    { kind: "instagram", label: "Instagram", handle: "@leeylammdva", url: "https://www.instagram.com/leeylammdva" },
  ],
  facts: [
    { value: "Python · Dart · JS", label: "Main languages" },
    { value: "Vice President", label: "ESOGU MACS Club" },
    { value: "5", label: "Languages spoken" },
  ],
  projects: [
    {
      slug: "dayanak",
      category: "01 · AI / Retrieval",
      name: "Dayanak",
      summary:
        "A legal-text assistant that answers with cited articles. Article-level vector search over Turkish law, with an evaluation suite that scores every change.",
      highlight: "Hybrid search (BM25 + vector) benchmarked, and rejected by the numbers.",
      tags: ["Python", "FastAPI", "pgvector", "bge-m3", "Next.js"],
      image: { url: "/projects/dayanak/cover.webp", alt: "Dayanak answering \"How long can a probation period be?\" with the matching law articles" },
      details: {
        year: "2026",
        tagline: "A source-citing legal assistant for Turkish labour and data-protection law.",
        overview:
          "Ask a question in plain Turkish, get the relevant law articles back with citations. Every retrieval change is measured against an evaluation set before it ships.",
        built: [
          "Ingest pipeline that splits laws (Labour Law, KVKK) into articles and paragraphs",
          "bge-m3 embeddings in PostgreSQL + pgvector, served by a FastAPI backend and a Next.js UI",
          "Evaluation suite: 17 retrieval experiments compared on Recall@k and MRR",
          "Hybrid BM25 + vector search benchmarked and rejected by the numbers; reranker and refusal threshold tested",
        ],
        stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "bge-m3", "Next.js", "React", "Docker", "pytest"],
        links: [],
        linksNote: "Source code available on request.",
        results: [
          { value: "0.776 → 0.812", label: "Recall@5 vs. baseline" },
          { value: "0.709 → 0.763", label: "MRR vs. baseline" },
          { value: "67", label: "Questions in the eval set" },
        ],
        screenshots: [
          { url: "/projects/dayanak/1.webp", alt: "Start screen with the question box and example questions" },
          { url: "/projects/dayanak/2.webp", alt: "The question rewritten for search, and law articles ranked for it" },
          { url: "/projects/dayanak/3.webp", alt: "Source panel with the full text of Labour Law article 15" },
        ],
      },
    },
    {
      slug: "matrink",
      category: "02 · Mobile",
      name: "MatrInk",
      summary:
        "A Flutter app combining a destiny-matrix calculator with handwriting analysis via Gemini Vision. Auth, paywall and a unit-tested core engine.",
      highlight: "Live at matrink.vercel.app",
      tags: ["Flutter", "Dart", "Supabase", "Edge Functions"],
      image: { url: "/projects/matrink/cover.webp", alt: "MatrInk landing page on three phone screens" },
      details: {
        year: "2026",
        tagline: "A Flutter app that pairs a destiny-matrix calculator with AI handwriting analysis.",
        overview:
          "Users photograph their handwriting and get an analysis from Gemini Vision, next to a destiny-matrix chart calculated on the device. Built end to end: auth, payments, notifications and accessibility settings.",
        built: [
          "Destiny-matrix engine in pure Dart, covered by 20 unit tests",
          "Handwriting flow: camera → Supabase Storage → Edge Function → Gemini Vision → report",
          "Subscriptions and one-off PDF purchases with RevenueCat, kept in sync by webhooks",
          "Dyslexia-friendly font option (OpenDyslexic), text size setting and a KVKK data export",
        ],
        stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "Edge Functions", "Gemini API", "RevenueCat"],
        links: [{ label: "Open the live app", url: "https://matrink.vercel.app" }],
        results: [
          { value: "20", label: "Unit tests on the matrix engine" },
          { value: "8", label: "Supabase Edge Functions" },
          { value: "Android · iOS", label: "Mobile targets" },
        ],
        screenshots: [
          { url: "/projects/matrink/1.webp", alt: "Landing page: \"Your handwriting tells your story\"" },
          { url: "/projects/matrink/2.webp", alt: "Free destiny-matrix calculator with a sample birth date" },
          { url: "/projects/matrink/3.webp", alt: "Feature list: handwriting analysis, matrix reading and daily reading" },
        ],
      },
    },
    {
      slug: "proofpay",
      category: "03 · Hackathon",
      name: "ProofPay",
      summary:
        "My entry for the PayPal AI Hackathon. Judging is still in progress — project details and the final ranking will be added here once the results are announced.",
      tags: [],
      status: "In progress · Results pending",
      cover: { title: "ProofPay", caption: "Details after the results" },
    },
    {
      slug: "bornin2",
      category: "04 · Game / Data",
      name: "bornin2",
      summary:
        "A browser game where you live one life as one of 100 babies born the same year. Birthplace, income, schooling and the odds of dying come from real World Bank data.",
      highlight: "10,000 simulated lives land within half a year of real life expectancy.",
      status: "In progress",
      tags: ["TypeScript", "esbuild", "Python", "World Bank data"],
      image: { url: "/projects/bornin2/cover.webp", alt: "Start screen with the grid of 100 babies born the same year" },
      details: {
        year: "2026",
        tagline: "Live one life as one of 100 babies born the same year, drawn from real-world data.",
        overview:
          "You are born somewhere on Earth, picked by real national birth counts. The 99 others born with you sit in a grid ordered by their family's world income rank, and their squares go dark as the years pass. Money never changes how a life plays out.",
        built: [
          "Seeded life-simulation engine built on life tables and income distributions",
          "185 countries and about 130 events and decisions: school, work, marriage, children, migration, illness and death",
          "Birth and death records, a life chart and a copyable summary of each life",
          "Character portraits that age with you, light and dark themes, a mobile layout and saves in the browser",
          "Python script that turns World Bank WDI data (CC BY 4.0) into the game's tables",
        ],
        stack: ["TypeScript", "esbuild", "Python", "World Bank WDI", "localStorage"],
        links: [],
        linksNote: "A public version is coming soon.",
        results: [
          { value: "69.8 vs 70.3", label: "Life expectancy: simulated vs. real" },
          { value: "3.5% vs 3.8%", label: "Deaths before age 5: simulated vs. real" },
          { value: "185", label: "Countries" },
        ],
        screenshots: [
          { url: "/projects/bornin2/1.webp", alt: "A life at age 27: status bars, a pixel-art scene and the life log" },
          { url: "/projects/bornin2/2.webp", alt: "A choice at age 5: picking first books" },
          { url: "/projects/bornin2/3.webp", alt: "Death record at 87, with the life summary, what-if choices and the outcome grid" },
        ],
      },
    },
    {
      slug: "night-shift",
      category: "05 · Hackathon / Game",
      name: "Night Shift",
      summary:
        "A 2D horror game for the Kiroween 2026 hackathon where bugs become monsters. Hide, open your laptop, fix real JavaScript and run the tests to make the monster go away.",
      status: "In progress · Hackathon until 5 Dec",
      tags: ["TypeScript", "Phaser 3", "Monaco Editor", "Vitest"],
      image: { url: "/projects/night-shift/cover.webp", alt: "Concept art: a dark office where monsters carry the names of buggy files" },
      details: {
        year: "2026",
        tagline: "A horror game where every monster is a real bug you fix in code.",
        overview:
          "Each bug turns into a monster named after the file it lives in. You hide in a dark office, open your laptop, fix the JavaScript and run its tests to make the monster disappear. At the end, a postmortem shows where you struggled.",
        built: [
          "Office scene with movement, a flashlight and hiding spots, built in Phaser 3",
          "Laptop scene with the Monaco editor and a test runner that runs in a Web Worker",
          "Three bug packs (Null Ghost, Off-by-One, Infinite Crawler) checked by a validation script",
          "Nine monster designs drawn as editable SVGs",
          "Property-based tests with fast-check, and Kiro specs and hooks for the workflow",
        ],
        stack: ["TypeScript", "Phaser 3", "Monaco Editor", "Vite", "Vitest", "fast-check", "Web Workers", "Kiro"],
        links: [{ label: "Source code on GitHub", url: "https://github.com/leimmdva/night-shift" }],
        linksNote: "Early prototype; the first two images are concept art.",
        results: [
          { value: "3", label: "Bug packs so far" },
          { value: "9", label: "Monster designs" },
          { value: "5 Dec 2026", label: "Hackathon deadline" },
        ],
        screenshots: [
          { url: "/projects/night-shift/1.webp", alt: "Concept art: Null Ghost, Memory Leech, Off-by-One and Legacy" },
          { url: "/projects/night-shift/2.webp", alt: "In-game laptop: fixing profile.js in the code editor and running its tests" },
        ],
      },
    },
  ],
  experience: [
    {
      period: "2025 — now",
      title: "Vice President · ESOGU MACS Club",
      description:
        "Previously Corporate Communications Coordinator of the Mathematics & Computer Science club.",
    },
    {
      period: "2025 — now",
      title: "Mentor · Frontend Web Development class",
      description: "Teaching HTML, CSS and JavaScript fundamentals to new developers.",
    },
    {
      period: "2023",
      title: "Freelance web developer",
      description: "Designed and built the website for Patel İnşaat, a construction company.",
    },
    {
      period: "2022 — now",
      title: "B.Sc. Mathematics & Computer Science",
      description: "Eskişehir Osmangazi University (ESOGU)",
    },
  ],
  skills: [
    { name: "Languages", items: ["Python", "TypeScript", "JavaScript", "Dart", "C#", "SQL"] },
    { name: "Frameworks", items: ["React", "Next.js", "Flutter", "FastAPI", "Node.js"] },
    { name: "AI & data", items: ["RAG", "Vector search", "pgvector", "Gemini API", "Evaluation"] },
    { name: "Infra & tools", items: ["PostgreSQL", "Supabase", "Firebase", "Docker", "Vercel", "Figma"] },
    { name: "Spoken", items: ["Azerbaijani", "Turkish", "English", "Russian", "German"] },
  ],
  contact: { before: "Let’s build something ", accent: "worth shipping." },
};
