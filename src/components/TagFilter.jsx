const TAGS = ["All", "Life", "Technology", "Thoughts", "Projects"];

export default function TagFilter({ active, onChange }) {
  return (
    <div className="pill-row">
      {TAGS.map((tag) => (
        <span
          key={tag}
          className={`pill${tag === active ? " active" : ""}`}
          onClick={() => onChange(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
