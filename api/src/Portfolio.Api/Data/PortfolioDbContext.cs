using Microsoft.EntityFrameworkCore;
using Portfolio.Core.Content;

namespace Portfolio.Api.Data;

public class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : DbContext(options)
{
    public DbSet<SiteProfile> SiteProfiles => Set<SiteProfile>();
    public DbSet<Fact> Facts => Set<Fact>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ExperienceItem> ExperienceItems => Set<ExperienceItem>();
    public DbSet<SkillGroup> SkillGroups => Set<SkillGroup>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<SiteProfile>(e =>
        {
            e.Property(p => p.Id).ValueGeneratedNever();
            e.ToTable(t => t.HasCheckConstraint("CK_SiteProfiles_Singleton", $"\"Id\" = {SiteProfile.SingletonId}"));
        });

        model.Entity<Project>(e =>
        {
            // A trashed project keeps its slug, so only live projects must be unique.
            e.HasIndex(p => p.Slug).IsUnique().HasFilter("\"DeletedAt\" IS NULL");
            e.OwnsOne(p => p.Details, d =>
            {
                d.ToJson();
                d.OwnsMany(x => x.Links);
                d.OwnsMany(x => x.Results);
            });
        });

        // Trashed items stay in the table for restore but never reach the site.
        model.Entity<Fact>().HasQueryFilter(x => x.DeletedAt == null);
        model.Entity<SocialLink>().HasQueryFilter(x => x.DeletedAt == null);
        model.Entity<Project>().HasQueryFilter(x => x.DeletedAt == null);
        model.Entity<ExperienceItem>().HasQueryFilter(x => x.DeletedAt == null);
        model.Entity<SkillGroup>().HasQueryFilter(x => x.DeletedAt == null);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        StampTimes();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        StampTimes();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    private void StampTimes()
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State is not (EntityState.Added or EntityState.Modified)) continue;
            switch (entry.Entity)
            {
                case ContentItem item:
                    if (entry.State == EntityState.Added) item.CreatedAt = now;
                    item.UpdatedAt = now;
                    break;
                case SiteProfile profile:
                    profile.UpdatedAt = now;
                    break;
            }
        }
    }
}
