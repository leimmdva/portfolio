namespace Portfolio.Core.Content;

/// <summary>One of the short stats under the hero, e.g. "Vice President / ESOGU MACS Club".</summary>
public class Fact : ContentItem
{
    public required string Value { get; set; }

    public required string Label { get; set; }
}
