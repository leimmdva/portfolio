namespace Portfolio.Core.Content;

public class ExperienceItem : ContentItem
{
    /// <summary>Free text such as "2025 — now".</summary>
    public required string Period { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }
}
