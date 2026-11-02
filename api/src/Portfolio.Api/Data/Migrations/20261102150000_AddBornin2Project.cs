using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Data.Migrations
{
    /// <summary>
    /// Adds the bornin2 project to databases that were seeded before it existed. The seeder only
    /// runs on an empty database, so this is how new content reaches the live site until the admin
    /// panel exists. It does nothing on an empty database (the seeder adds bornin2 there)
    /// or when a live project already uses the slug.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20261102150000_AddBornin2Project")]
    public partial class AddBornin2Project : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                INSERT INTO "Projects" ("Slug", "Category", "Name", "Summary", "Highlight", "Tags", "Status", "SortOrder", "CreatedAt", "UpdatedAt", "Details")
                SELECT 'bornin2', '04 · Game / Data', 'bornin2',
                       'A browser game where you live one life as one of 100 babies born the same year. Birthplace, income, schooling and the odds of dying come from real World Bank data.',
                       '10,000 simulated lives land within half a year of real life expectancy.',
                       ARRAY['TypeScript', 'esbuild', 'Python', 'World Bank data'],
                       'In progress',
                       (SELECT COALESCE(MAX("SortOrder"), -1) + 1 FROM "Projects"),
                       now(), now(),
                       '{"Year": "2026", "Tagline": "Live one life as one of 100 babies born the same year, drawn from real-world data.", "Overview": "You are born somewhere on Earth, picked by real national birth counts. The 99 others born with you sit in a grid ordered by their family''s world income rank, and their squares go dark as the years pass. Money never changes how a life plays out.", "Built": ["Seeded life-simulation engine built on life tables and income distributions", "185 countries and about 130 events and decisions: school, work, marriage, children, migration, illness and death", "Birth and death records, a life chart and a copyable summary of each life", "Character portraits that age with you, light and dark themes, a mobile layout and saves in the browser", "Python script that turns World Bank WDI data (CC BY 4.0) into the game''s tables"], "Stack": ["TypeScript", "esbuild", "Python", "World Bank WDI", "localStorage"], "Links": [], "LinksNote": "A public version is coming soon.", "Results": [{"Value": "69.8 vs 70.3", "Label": "Life expectancy: simulated vs. real"}, {"Value": "3.5% vs 3.8%", "Label": "Deaths before age 5: simulated vs. real"}, {"Value": "185", "Label": "Countries"}]}'::jsonb
                WHERE EXISTS (SELECT 1 FROM "SiteProfiles")
                  AND NOT EXISTS (SELECT 1 FROM "Projects" WHERE "Slug" = 'bornin2' AND "DeletedAt" IS NULL);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "Projects" WHERE "Slug" = 'bornin2';""");
        }
    }
}
