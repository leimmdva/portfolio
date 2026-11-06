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
            ImageUrl = "/projects/dayanak/cover.webp",
            ImageAlt = "Dayanak answering \"How long can a probation period be?\" with the matching law articles",
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
                Screenshots =
                [
                    new() { Url = "/projects/dayanak/1.webp", Alt = "Start screen with the question box and example questions" },
                    new() { Url = "/projects/dayanak/2.webp", Alt = "The question rewritten for search, and law articles ranked for it" },
                    new() { Url = "/projects/dayanak/3.webp", Alt = "Source panel with the full text of Labour Law article 15" },
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
            ImageUrl = "/projects/matrink/cover.webp",
            ImageAlt = "MatrInk landing page on three phone screens",
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
                Screenshots =
                [
                    new() { Url = "/projects/matrink/1.webp", Alt = "Landing page: \"Your handwriting tells your story\"" },
                    new() { Url = "/projects/matrink/2.webp", Alt = "Free destiny-matrix calculator with a sample birth date" },
                    new() { Url = "/projects/matrink/3.webp", Alt = "Feature list: handwriting analysis, matrix reading and daily reading" },
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
        Bornin2(),
        NightShift(),
    ]);

    /// <summary>bornin2, added after launch; the AddBornin2Project migration inserts the same project into existing databases.</summary>
    public static Project Bornin2() => new()
    {
        Slug = "bornin2",
        Category = "04 · Game / Data",
        Name = "bornin2",
        Summary = "A browser game where you live one life as one of 100 babies born the same year. Birthplace, income, schooling and the odds of dying come from real World Bank data.",
        Highlight = "10,000 simulated lives land within half a year of real life expectancy.",
        Status = "In progress",
        Tags = ["TypeScript", "esbuild", "Python", "World Bank data"],
        ImageUrl = "/projects/bornin2/cover.webp",
        ImageAlt = "Start screen with the grid of 100 babies born the same year",
        Details = new()
        {
            Year = "2026",
            Tagline = "Live one life as one of 100 babies born the same year, drawn from real-world data.",
            Overview = "You are born somewhere on Earth, picked by real national birth counts. The 99 others born with you sit in a grid ordered by their family's world income rank, and their squares go dark as the years pass. Money never changes how a life plays out.",
            Built =
            [
                "Seeded life-simulation engine built on life tables and income distributions",
                "185 countries and about 130 events and decisions: school, work, marriage, children, migration, illness and death",
                "Birth and death records, a life chart and a copyable summary of each life",
                "Character portraits that age with you, light and dark themes, a mobile layout and saves in the browser",
                "Python script that turns World Bank WDI data (CC BY 4.0) into the game's tables",
            ],
            Stack = ["TypeScript", "esbuild", "Python", "World Bank WDI", "localStorage"],
            Links = [],
            LinksNote = "A public version is coming soon.",
            Results =
            [
                new() { Value = "69.8 vs 70.3", Label = "Life expectancy: simulated vs. real" },
                new() { Value = "3.5% vs 3.8%", Label = "Deaths before age 5: simulated vs. real" },
                new() { Value = "185", Label = "Countries" },
            ],
            Screenshots =
            [
                new() { Url = "/projects/bornin2/1.webp", Alt = "A life at age 27: status bars, a pixel-art scene and the life log" },
                new() { Url = "/projects/bornin2/2.webp", Alt = "A choice at age 5: picking first books" },
                new() { Url = "/projects/bornin2/3.webp", Alt = "Death record at 87, with the life summary, what-if choices and the outcome grid" },
            ],
        },
    };

    /// <summary>Night Shift, added with the screenshots; the ProjectScreenshots migration inserts it into existing databases.</summary>
    public static Project NightShift() => new()
    {
        Slug = "night-shift",
        Category = "05 · Hackathon / Game",
        Name = "Night Shift",
        Summary = "A 2D horror game for the Kiroween 2026 hackathon where bugs become monsters. Hide, open your laptop, fix real JavaScript and run the tests to make the monster go away.",
        Status = "In progress · Hackathon until 5 Dec",
        Tags = ["TypeScript", "Phaser 3", "Monaco Editor", "Vitest"],
        ImageUrl = "/projects/night-shift/cover.webp",
        ImageAlt = "Concept art: a dark office where monsters carry the names of buggy files",
        Details = new()
        {
            Year = "2026",
            Tagline = "A horror game where every monster is a real bug you fix in code.",
            Overview = "Each bug turns into a monster named after the file it lives in. You hide in a dark office, open your laptop, fix the JavaScript and run its tests to make the monster disappear. At the end, a postmortem shows where you struggled.",
            Built =
            [
                "Office scene with movement, a flashlight and hiding spots, built in Phaser 3",
                "Laptop scene with the Monaco editor and a test runner that runs in a Web Worker",
                "Three bug packs (Null Ghost, Off-by-One, Infinite Crawler) checked by a validation script",
                "Nine monster designs drawn as editable SVGs",
                "Property-based tests with fast-check, and Kiro specs and hooks for the workflow",
            ],
            Stack = ["TypeScript", "Phaser 3", "Monaco Editor", "Vite", "Vitest", "fast-check", "Web Workers", "Kiro"],
            Links = [new() { Label = "Source code on GitHub", Url = "https://github.com/leimmdva/night-shift" }],
            LinksNote = "Early prototype; the first two images are concept art.",
            Results =
            [
                new() { Value = "3", Label = "Bug packs so far" },
                new() { Value = "9", Label = "Monster designs" },
                new() { Value = "5 Dec 2026", Label = "Hackathon deadline" },
            ],
            Screenshots =
            [
                new() { Url = "/projects/night-shift/1.webp", Alt = "Concept art: Null Ghost, Memory Leech, Off-by-One and Legacy" },
                new() { Url = "/projects/night-shift/2.webp", Alt = "In-game laptop: fixing profile.js in the code editor and running its tests" },
            ],
        },
    };

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
