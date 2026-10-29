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
  email: "lmmdva6@gmail.com",
  cvUrl: "/Leyla-Mammadova-CV.pdf",
  availability: "Open to internships · 2026",
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
    { value: "4", label: "Languages spoken" },
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
    { name: "Spoken", items: ["Azerbaijani", "Turkish", "English", "Russian"] },
  ],
  contact: { before: "Let’s build something ", accent: "worth shipping." },
};
