using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Data.Migrations
{
    /// <summary>
    /// Adds the Lalamebel project to databases seeded before it existed. The seeder only runs on an
    /// empty database (where it adds Lalamebel itself), so this does nothing there, or when a live
    /// project already uses the slug.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20261117120000_AddLalamebelProject")]
    public partial class AddLalamebelProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                INSERT INTO "Projects" ("Slug", "Category", "Name", "Summary", "Highlight", "Tags", "Status", "CoverTitle", "CoverCaption", "SortOrder", "CreatedAt", "UpdatedAt", "Details")
                SELECT 'lalamebel', '06 · Client / Marketplace', 'Lalamebel',
                       'A second-hand furniture and goods shop for lalamebel.store: a storefront in Azerbaijani and Russian, a phone-first admin app for listings, and an API behind both.',
                       'A listing goes from the phone''s share sheet to the live storefront in one step.',
                       ARRAY['React', 'TypeScript', 'ASP.NET Core', 'PostgreSQL'],
                       'In progress',
                       'Lalamebel',
                       'Storefront · Admin app · API',
                       (SELECT COALESCE(MAX("SortOrder"), -1) + 1 FROM "Projects"),
                       now(), now(),
                       '{"Year": "2026", "Tagline": "A storefront, an admin app and an API for a second-hand goods shop.", "Overview": "Buyers browse the storefront in Azerbaijani or Russian, open a product and message the shop on WhatsApp with the product already in the text. The owner adds and updates listings from a phone app, and the API keeps listings, photos and simple stats in one place.", "Built": ["Animated, mobile-friendly storefront in Azerbaijani and Russian, with a detail page per product and a WhatsApp button that pre-fills the message", "Installable admin app (PWA) for listings with up to 12 photos and a video, auto-filled WhatsApp text and a stats screen", "Android share target, so photos shared from the gallery open straight in a new listing", "ASP.NET Core Minimal API with EF Core and PostgreSQL: admin sign-in with JWT, publish and sold states, view and WhatsApp counters", "Sitemap and link previews, so shared product links show the photo and price"], "Stack": ["React", "Vite", "TypeScript", "PWA", "HTML", "CSS", "JavaScript", "ASP.NET Core", ".NET 10", "EF Core", "PostgreSQL", "Neon", "Cloudinary", "Render", "Vercel"], "Links": [{"Label": "Open the storefront", "Url": "https://lala-vitrin.vercel.app"}], "Results": [{"Value": "3", "Label": "Apps: storefront, admin and API"}, {"Value": "AZ · RU", "Label": "Storefront languages"}, {"Value": "12 + 1", "Label": "Photos and video per listing"}], "Screenshots": []}'::jsonb
                WHERE EXISTS (SELECT 1 FROM "SiteProfiles")
                  AND NOT EXISTS (SELECT 1 FROM "Projects" WHERE "Slug" = 'lalamebel' AND "DeletedAt" IS NULL);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""DELETE FROM "Projects" WHERE "Slug" = 'lalamebel';""");
        }
    }
}
