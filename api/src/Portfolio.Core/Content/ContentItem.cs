namespace Portfolio.Core.Content;

/// <summary>
/// A list item editors can reorder and move to the trash.
/// </summary>
public abstract class ContentItem
{
    public int Id { get; set; }

    /// <summary>Position in its list, lowest first.</summary>
    public int SortOrder { get; set; }

    /// <summary>Set when the item is in the trash; it can be restored for 30 days.</summary>
    public DateTimeOffset? DeletedAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
