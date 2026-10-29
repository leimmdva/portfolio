using Portfolio.Core.Content;

namespace Portfolio.Api.Data;

/// <summary>
/// The site text as it was in web/app/content/site.ts when content moved into the database.
/// Seeded once into an empty database; after that the admin panel owns it.
/// </summary>
public static class InitialContent
{
    public static SiteProfile Profile() => new()
    {
        Name = "Leyla Mammadova",
        Email = "info@leylammdva.com",
        CvUrl = "/Leyla-Mammadova-CV.pdf",
        Availability = "Open to mid-level roles",
        HeadlineBefore = "I build ",
        HeadlineAccent = "full-stack",
        HeadlineAfter = " products, from retrieval AI to mobile apps.",
        Lead = "Math & Computer Science student at ESOGU, building full-stack web and mobile products — lately with a focus on retrieval-augmented AI and Flutter apps.",
        ContactBefore = "Let’s build something ",
        ContactAccent = "worth shipping.",
    };

    public static List<SocialLink> Socials() => Ordered<SocialLink>(
    [
        new() { Kind = "linkedin", Label = "LinkedIn", Handle = "in/lmmmdva", Url = "https://www.linkedin.com/in/lmmmdva" },
        new() { Kind = "github", Label = "GitHub", Handle = "leimmdva", Url = "https://github.com/leimmdva" },
        new() { Kind = "instagram", Label = "Instagram", Handle = "@leeylammdva", Url = "https://www.instagram.com/leeylammdva" },
    ]);

    public static List<Fact> Facts() => Ordered<Fact>(
    [
        new() { Value = "Python · Dart · JS", Label = "Main languages" },
        new() { Value = "Vice President", Label = "ESOGU MACS Club" },
        new() { Value = "5", Label = "Languages spoken" },
    ]);

    public static List<Project> Projects() => Ordered<Project>(
    [
        new()
        {
            Slug = "dayanak",
            Category = "01 · AI / Retrieval",
            Name = "Dayanak",
            Summary = "A legal-text assistant that answers with cited articles. Article-level vector search over Turkish law, with an evaluation suite that scores every change.",
            Highlight = "Hybrid search (BM25 + vector) benchmarked, and rejected by the numbers.",
            Tags = ["Python", "FastAPI", "pgvector", "bge-m3", "Next.js"],
            Details = new()
            {
                Year = "2026",
                Tagline = "A source-citing legal assistant for Turkish labour and data-protection law.",
                Overview = "Ask a question in plain Turkish, get the relevant law articles back with citations. Every retrieval change is measured against an evaluation set before it ships.",
                Built =
                [
                    "Ingest pipeline that splits laws (Labour Law, KVKK) into articles and paragraphs",
                    "bge-m3 embeddings in PostgreSQL + pgvector, served by a FastAPI backend and a Next.js UI",
                    "Evaluation suite: 17 retrieval experiments compared on Recall@k and MRR",
                    "Hybrid BM25 + vector search benchmarked and rejected by the numbers; reranker and refusal threshold tested",
                ],
                Stack = ["Python", "FastAPI", "PostgreSQL", "pgvector", "bge-m3", "Next.js", "React", "Docker", "pytest"],
                LinksNote = "Source code available on request.",
                Results =
                [
                    new() { Value = "0.776 → 0.812", Label = "Recall@5 vs. baseline" },
                    new() { Value = "0.709 → 0.763", Label = "MRR vs. baseline" },
                    new() { Value = "67", Label = "Questions in the eval set" },
                ],
            },
        },
        new()
        {
            Slug = "matrink",
            Category = "02 · Mobile",
            Name = "MatrInk",
            Summary = "A Flutter app combining a destiny-matrix calculator with handwriting analysis via Gemini Vision. Auth, paywall and a unit-tested core engine.",
            Highlight = "Live at matrink.vercel.app",
            Tags = ["Flutter", "Dart", "Supabase", "Edge Functions"],
            Details = new()
            {
                Year = "2026",
                Tagline = "A Flutter app that pairs a destiny-matrix calculator with AI handwriting analysis.",
                Overview = "Users photograph their handwriting and get an analysis from Gemini Vision, next to a destiny-matrix chart calculated on the device. Built end to end: auth, payments, notifications and accessibility settings.",
                Built =
                [
                    "Destiny-matrix engine in pure Dart, covered by 20 unit tests",
                    "Handwriting flow: camera → Supabase Storage → Edge Function → Gemini Vision → report",
                    "Subscriptions and one-off PDF purchases with RevenueCat, kept in sync by webhooks",
                    "Dyslexia-friendly font option (OpenDyslexic), text size setting and a KVKK data export",
                ],
                Stack = ["Flutter", "Dart", "Supabase", "PostgreSQL", "Edge Functions", "Gemini API", "RevenueCat"],
                Links = [new() { Label = "Open the live app", Url = "https://matrink.vercel.app" }],
                Results =
                [
                    new() { Value = "20", Label = "Unit tests on the matrix engine" },
                    new() { Value = "8", Label = "Supabase Edge Functions" },
                    new() { Value = "Android · iOS", Label = "Mobile targets" },
                ],
            },
        },
        new()
        {
            Slug = "proofpay",
            Category = "03 · Hackathon",
            Name = "ProofPay",
            Summary = "My entry for the PayPal AI Hackathon. Judging is still in progress — project details and the final ranking will be added here once the results are announced.",
            Status = "In progress · Results pending",
            CoverTitle = "ProofPay",
            CoverCaption = "Details after the results",
        },
    ]);

    public static List<ExperienceItem> Experience() => Ordered<ExperienceItem>(
    [
        new() { Period = "2025 — now", Title = "Vice President · ESOGU MACS Club", Description = "Previously Corporate Communications Coordinator of the Mathematics & Computer Science club." },
        new() { Period = "2025 — now", Title = "Mentor · Frontend Web Development class", Description = "Teaching HTML, CSS and JavaScript fundamentals to new developers." },
        new() { Period = "2023", Title = "Freelance web developer", Description = "Designed and built the website for Patel İnşaat, a construction company." },
        new() { Period = "2022 — now", Title = "B.Sc. Mathematics & Computer Science", Description = "Eskişehir Osmangazi University (ESOGU)" },
    ]);

    public static List<SkillGroup> Skills() => Ordered<SkillGroup>(
    [
        new() { Name = "Languages", Items = ["Python", "TypeScript", "JavaScript", "Dart", "C#", "SQL"] },
        new() { Name = "Frameworks", Items = ["React", "Next.js", "Flutter", "FastAPI", "Node.js"] },
        new() { Name = "AI & data", Items = ["RAG", "Vector search", "pgvector", "Gemini API", "Evaluation"] },
        new() { Name = "Infra & tools", Items = ["PostgreSQL", "Supabase", "Firebase", "Docker", "Vercel", "Figma"] },
        new() { Name = "Spoken", Items = ["Azerbaijani", "Turkish", "English", "Russian", "German"] },
    ]);

    private static List<T> Ordered<T>(List<T> items) where T : ContentItem
    {
        for (var i = 0; i < items.Count; i++) items[i].SortOrder = i;
        return items;
    }
}
