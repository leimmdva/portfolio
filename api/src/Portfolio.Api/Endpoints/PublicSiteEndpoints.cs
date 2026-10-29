using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Core.Content;

namespace Portfolio.Api.Endpoints;

/// <summary>
/// Read-only content for the public site. The web build fetches this once and pre-renders the page.
/// The response matches <c>SiteContent</c> in web/app/content/site.ts.
/// </summary>
public static class PublicSiteEndpoints
{
    public static void MapPublicSiteEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/public/site", GetSite).WithName("GetPublicSite");
    }

    private static async Task<IResult> GetSite(PortfolioDbContext db, CancellationToken ct)
    {
        var profile = await db.SiteProfiles.AsNoTracking().SingleOrDefaultAsync(ct);
        if (profile is null) return Results.Problem("Site content has not been set up yet.", statusCode: 404);

        var socials = await db.SocialLinks.AsNoTracking().OrderBy(x => x.SortOrder).ToListAsync(ct);
        var facts = await db.Facts.AsNoTracking().OrderBy(x => x.SortOrder).ToListAsync(ct);
        var projects = await db.Projects.AsNoTracking().OrderBy(x => x.SortOrder).ToListAsync(ct);
        var experience = await db.ExperienceItems.AsNoTracking().OrderBy(x => x.SortOrder).ToListAsync(ct);
        var skills = await db.SkillGroups.AsNoTracking().OrderBy(x => x.SortOrder).ToListAsync(ct);

        return Results.Ok(new SiteDto(
            profile.Name,
            profile.Email,
            profile.CvUrl,
            profile.Availability,
            new HeadlineDto(profile.HeadlineBefore, profile.HeadlineAccent, profile.HeadlineAfter),
            profile.Lead,
            socials.Select(s => new SocialDto(s.Kind, s.Label, s.Handle, s.Url)).ToList(),
            facts.Select(f => new FactDto(f.Value, f.Label)).ToList(),
            projects.Select(ToDto).ToList(),
            experience.Select(e => new TimelineItemDto(e.Period, e.Title, e.Description)).ToList(),
            skills.Select(s => new SkillGroupDto(s.Name, s.Items)).ToList(),
            new ContactDto(profile.ContactBefore, profile.ContactAccent)));
    }

    private static ProjectDto ToDto(Project p) => new(
        p.Slug,
        p.Category,
        p.Name,
        p.Summary,
        p.Highlight,
        p.Tags,
        p.Status,
        p.CoverTitle is null ? null : new CoverDto(p.CoverTitle, p.CoverCaption ?? ""),
        p.Details is not { } d ? null : new ProjectDetailsDto(
            d.Year,
            d.Tagline,
            d.Overview,
            d.Built,
            d.Stack,
            d.Links.Select(l => new LinkDto(l.Label, l.Url)).ToList(),
            d.LinksNote,
            d.Results.Select(r => new ResultDto(r.Value, r.Label)).ToList()));
}

public record SiteDto(
    string Name,
    string Email,
    string CvUrl,
    string Availability,
    HeadlineDto Headline,
    string Lead,
    List<SocialDto> Socials,
    List<FactDto> Facts,
    List<ProjectDto> Projects,
    List<TimelineItemDto> Experience,
    List<SkillGroupDto> Skills,
    ContactDto Contact);

public record HeadlineDto(string Before, string Accent, string After);

public record SocialDto(string Kind, string Label, string Handle, string Url);

public record FactDto(string Value, string Label);

public record ProjectDto(
    string Slug,
    string Category,
    string Name,
    string Summary,
    string? Highlight,
    List<string> Tags,
    string? Status,
    CoverDto? Cover,
    ProjectDetailsDto? Details);

public record CoverDto(string Title, string Caption);

public record ProjectDetailsDto(
    string Year,
    string Tagline,
    string Overview,
    List<string> Built,
    List<string> Stack,
    List<LinkDto> Links,
    string? LinksNote,
    List<ResultDto> Results);

public record LinkDto(string Label, string Url);

public record ResultDto(string Value, string Label);

public record TimelineItemDto(string Period, string Title, string Description);

public record SkillGroupDto(string Name, List<string> Items);

public record ContactDto(string Before, string Accent);
