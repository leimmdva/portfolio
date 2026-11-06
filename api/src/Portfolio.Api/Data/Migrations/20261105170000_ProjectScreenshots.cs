using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Data.Migrations
{
    /// <summary>
    /// Brings the screenshots and Night Shift to databases seeded before them. The seeder only
    /// fills an empty database, so this is how they reach the live site until the admin panel
    /// exists. A project that already has a card image is left alone, and so is an empty database.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20261105170000_ProjectScreenshots")]
    public partial class ProjectScreenshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE "Projects"
                SET "ImageUrl" = '/projects/dayanak/cover.webp',
                    "ImageAlt" = 'Dayanak answering "How long can a probation period be?" with the matching law articles',
                    "Details" = jsonb_set("Details", '{Screenshots}', '[{"Url": "/projects/dayanak/1.webp", "Alt": "Start screen with the question box and example questions"}, {"Url": "/projects/dayanak/2.webp", "Alt": "The question rewritten for search, and law articles ranked for it"}, {"Url": "/projects/dayanak/3.webp", "Alt": "Source panel with the full text of Labour Law article 15"}]'::jsonb),
                    "UpdatedAt" = now()
                WHERE "Slug" = 'dayanak' AND "DeletedAt" IS NULL AND "ImageUrl" IS NULL AND "Details" IS NOT NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE "Projects"
                SET "ImageUrl" = '/projects/matrink/cover.webp',
                    "ImageAlt" = 'MatrInk landing page on three phone screens',
                    "Details" = jsonb_set("Details", '{Screenshots}', '[{"Url": "/projects/matrink/1.webp", "Alt": "Landing page: \"Your handwriting tells your story\""}, {"Url": "/projects/matrink/2.webp", "Alt": "Free destiny-matrix calculator with a sample birth date"}, {"Url": "/projects/matrink/3.webp", "Alt": "Feature list: handwriting analysis, matrix reading and daily reading"}]'::jsonb),
                    "UpdatedAt" = now()
                WHERE "Slug" = 'matrink' AND "DeletedAt" IS NULL AND "ImageUrl" IS NULL AND "Details" IS NOT NULL;
                """);

            migrationBuilder.Sql(
                """
                UPDATE "Projects"
                SET "ImageUrl" = '/projects/bornin2/cover.webp',
                    "ImageAlt" = 'Start screen with the grid of 100 babies born the same year',
                    "Details" = jsonb_set("Details", '{Screenshots}', '[{"Url": "/projects/bornin2/1.webp", "Alt": "A life at age 27: status bars, a pixel-art scene and the life log"}, {"Url": "/projects/bornin2/2.webp", "Alt": "A choice at age 5: picking first books"}, {"Url": "/projects/bornin2/3.webp", "Alt": "Death record at 87, with the life summary, what-if choices and the outcome grid"}]'::jsonb),
                    "UpdatedAt" = now()
                WHERE "Slug" = 'bornin2' AND "DeletedAt" IS NULL AND "ImageUrl" IS NULL AND "Details" IS NOT NULL;
                """);

            migrationBuilder.Sql(
                """
                INSERT INTO "Projects" ("Slug", "Category", "Name", "Summary", "Tags", "Status", "ImageUrl", "ImageAlt", "SortOrder", "CreatedAt", "UpdatedAt", "Details")
                SELECT 'night-shift', '05 · Hackathon / Game', 'Night Shift',
                       'A 2D horror game for the Kiroween 2026 hackathon where bugs become monsters. Hide, open your laptop, fix real JavaScript and run the tests to make the monster go away.',
                       ARRAY['TypeScript', 'Phaser 3', 'Monaco Editor', 'Vitest'],
                       'In progress · Hackathon until 5 Dec',
                       '/projects/night-shift/cover.webp',
                       'Concept art: a dark office where monsters carry the names of buggy files',
                       (SELECT COALESCE(MAX("SortOrder"), -1) + 1 FROM "Projects"),
                       now(), now(),
                       '{"Year": "2026", "Tagline": "A horror game where every monster is a real bug you fix in code.", "Overview": "Each bug turns into a monster named after the file it lives in. You hide in a dark office, open your laptop, fix the JavaScript and run its tests to make the monster disappear. At the end, a postmortem shows where you struggled.", "Built": ["Office scene with movement, a flashlight and hiding spots, built in Phaser 3", "Laptop scene with the Monaco editor and a test runner that runs in a Web Worker", "Three bug packs (Null Ghost, Off-by-One, Infinite Crawler) checked by a validation script", "Nine monster designs drawn as editable SVGs", "Property-based tests with fast-check, and Kiro specs and hooks for the workflow"], "Stack": ["TypeScript", "Phaser 3", "Monaco Editor", "Vite", "Vitest", "fast-check", "Web Workers", "Kiro"], "Links": [{"Label": "Source code on GitHub", "Url": "https://github.com/leimmdva/night-shift"}], "LinksNote": "Early prototype; the first two images are concept art.", "Results": [{"Value": "3", "Label": "Bug packs so far"}, {"Value": "9", "Label": "Monster designs"}, {"Value": "5 Dec 2026", "Label": "Hackathon deadline"}], "Screenshots": [{"Url": "/projects/night-shift/1.webp", "Alt": "Concept art: Null Ghost, Memory Leech, Off-by-One and Legacy"}, {"Url": "/projects/night-shift/2.webp", "Alt": "In-game laptop: fixing profile.js in the code editor and running its tests"}]}'::jsonb
                WHERE EXISTS (SELECT 1 FROM "SiteProfiles")
                  AND NOT EXISTS (SELECT 1 FROM "Projects" WHERE "Slug" = 'night-shift' AND "DeletedAt" IS NULL);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "Projects" WHERE "Slug" = 'night-shift';""");
            migrationBuilder.Sql(
                """
                UPDATE "Projects"
                SET "ImageUrl" = NULL, "ImageAlt" = NULL, "Details" = "Details" - 'Screenshots'
                WHERE "Slug" IN ('dayanak', 'matrink', 'bornin2') AND "ImageUrl" LIKE '/projects/%';
                """);
        }
    }
}
