using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Data.Migrations
{
    /// <summary>
    /// Points the LinkedIn link at the right profile (in/lmmmdva6) on databases seeded with the old one.
    /// Only touches the row while it still has the old URL, so an edit made in the admin is kept.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20261117160000_FixLinkedInHandle")]
    public partial class FixLinkedInHandle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE "SocialLinks"
                SET "Handle" = 'in/lmmmdva6', "Url" = 'https://www.linkedin.com/in/lmmmdva6'
                WHERE "Kind" = 'linkedin' AND "Url" = 'https://www.linkedin.com/in/lmmmdva';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE "SocialLinks"
                SET "Handle" = 'in/lmmmdva', "Url" = 'https://www.linkedin.com/in/lmmmdva'
                WHERE "Kind" = 'linkedin' AND "Url" = 'https://www.linkedin.com/in/lmmmdva6';
                """);
        }
    }
}
