namespace Portfolio.Core.Content;

public class SocialLink : ContentItem
{
    /// <summary>Picks the icon: "linkedin", "github" or "instagram".</summary>
    public required string Kind { get; set; }

    public required string Label { get; set; }

    public required string Handle { get; set; }

    public required string Url { get; set; }
}
