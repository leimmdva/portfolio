namespace Portfolio.Core.Content;

/// <summary>
/// The single row of site-wide text: name, hero and contact copy.
/// </summary>
public class SiteProfile
{
    public const int SingletonId = 1;

    public int Id { get; set; } = SingletonId;

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string CvUrl { get; set; }

    public required string Availability { get; set; }

    public required string HeadlineBefore { get; set; }

    /// <summary>The italic, accent-coloured part of the headline.</summary>
    public required string HeadlineAccent { get; set; }

    public required string HeadlineAfter { get; set; }

    public required string Lead { get; set; }

    public required string ContactBefore { get; set; }

    public required string ContactAccent { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
