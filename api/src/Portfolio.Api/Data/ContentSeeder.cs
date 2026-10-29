using Microsoft.EntityFrameworkCore;

namespace Portfolio.Api.Data;

/// <summary>
/// Fills an empty database with <see cref="InitialContent"/>. Runs after every migrate,
/// but only writes when no site profile exists yet, so admin edits are never overwritten.
/// </summary>
public static class ContentSeeder
{
    public static async Task SeedAsync(DbContext context, CancellationToken ct = default)
    {
        var db = (PortfolioDbContext)context;
        if (await db.SiteProfiles.AnyAsync(ct)) return;

        db.SiteProfiles.Add(InitialContent.Profile());
        db.SocialLinks.AddRange(InitialContent.Socials());
        db.Facts.AddRange(InitialContent.Facts());
        db.Projects.AddRange(InitialContent.Projects());
        db.ExperienceItems.AddRange(InitialContent.Experience());
        db.SkillGroups.AddRange(InitialContent.Skills());
        await db.SaveChangesAsync(ct);
    }

    public static void Seed(DbContext context) => SeedAsync(context).GetAwaiter().GetResult();
}
