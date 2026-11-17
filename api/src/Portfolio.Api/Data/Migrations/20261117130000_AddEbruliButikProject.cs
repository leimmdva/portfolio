using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Data.Migrations
{
    /// <summary>
    /// Adds the Ebruli Butik project to databases seeded before it existed. The seeder only runs on
    /// an empty database (where it adds Ebruli Butik itself), so this does nothing there, or when a
    /// live project already uses the slug.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20261117130000_AddEbruliButikProject")]
    public partial class AddEbruliButikProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                INSERT INTO "Projects" ("Slug", "Category", "Name", "Summary", "Highlight", "Tags", "Status", "CoverTitle", "CoverCaption", "SortOrder", "CreatedAt", "UpdatedAt", "Details")
                SELECT 'ebruli-butik', '07 · Client / Website', 'Ebruli Butik',
                       'A one-page, animated and mobile-friendly site for Ebruli Butik, a clothing boutique in Eskişehir. Visitors browse the collection and ask about any piece on WhatsApp in one tap.',
                       'Plain HTML, CSS and JavaScript: no build step and no libraries.',
                       ARRAY['HTML', 'CSS', 'JavaScript'],
                       'Live',
                       'Ebruli Butik',
                       'One-page site · Eskişehir',
                       (SELECT COALESCE(MAX("SortOrder"), -1) + 1 FROM "Projects"),
                       now(), now(),
                       '{"Year": "2026", "Tagline": "An animated one-page site for a clothing boutique in Eskişehir.", "Overview": "The site introduces the boutique, shows the collection with category filters and sends visitors to WhatsApp with the product name already in the message. It ends with the address, opening hours, phone and directions, and a label shows whether the shop is open right now.", "Built": ["Collection with category filters and product cards, each with an \"Ask on WhatsApp\" button that puts the product name in the message", "Sections that appear as you scroll, a sliding \"New season\" banner and a pink and beige theme", "\"Open now\" label worked out from the opening hours", "Mobile menu and a WhatsApp button that stays on screen on phones", "Clean URLs and cache headers on Vercel; animations turn off when reduced motion is on"], "Stack": ["HTML", "CSS", "JavaScript", "Vercel"], "Links": [{"Label": "Open the site", "Url": "https://ebruli-butik.vercel.app"}], "LinksNote": "Products and prices are sample content until the real photos arrive.", "Results": [{"Value": "1", "Label": "Page"}, {"Value": "7", "Label": "Sections"}, {"Value": "0", "Label": "Build steps or libraries"}], "Screenshots": []}'::jsonb
                WHERE EXISTS (SELECT 1 FROM "SiteProfiles")
                  AND NOT EXISTS (SELECT 1 FROM "Projects" WHERE "Slug" = 'ebruli-butik' AND "DeletedAt" IS NULL);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "Projects" WHERE "Slug" = 'ebruli-butik';""");
        }
    }
}
