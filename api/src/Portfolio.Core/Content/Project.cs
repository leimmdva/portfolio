namespace Portfolio.Core.Content;

public class Project : ContentItem
{
    /// <summary>URL-safe id, used in <c>?project=</c> links.</summary>
    public required string Slug { get; set; }

    /// <summary>Small label above the name, e.g. "01 · AI / Retrieval".</summary>
    public required string Category { get; set; }

    public required string Name { get; set; }

    public required string Summary { get; set; }

    /// <summary>One line with an accent bar on the card.</summary>
    public string? Highlight { get; set; }

    public List<string> Tags { get; set; } = [];

    /// <summary>Shown as a pill instead of tags, e.g. "In progress · Results pending".</summary>
    public string? Status { get; set; }

    /// <summary>Dark cover text when there is no screenshot yet.</summary>
    public string? CoverTitle { get; set; }

    public string? CoverCaption { get; set; }

    /// <summary>Detail dialog content; the card has no "View details" button while this is empty.</summary>
    public ProjectDetails? Details { get; set; }
}

public class ProjectDetails
{
    public required string Year { get; set; }

    public required string Tagline { get; set; }

    public required string Overview { get; set; }

    public List<string> Built { get; set; } = [];

    public List<string> Stack { get; set; } = [];

    public List<ProjectLink> Links { get; set; } = [];

    /// <summary>Shown under the links, e.g. "Source code available on request."</summary>
    public string? LinksNote { get; set; }

    public List<ProjectResult> Results { get; set; } = [];
}

public class ProjectLink
{
    public required string Label { get; set; }

    public required string Url { get; set; }
}

public class ProjectResult
{
    public required string Value { get; set; }

    public required string Label { get; set; }
}
