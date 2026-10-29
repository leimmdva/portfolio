namespace Portfolio.Core.Content;

public class SkillGroup : ContentItem
{
    public required string Name { get; set; }

    public List<string> Items { get; set; } = [];
}
