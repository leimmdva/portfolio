export default function TagFilter({ tags, active, onChange }) {
  return (
    <div className="pill-row">
      {tags.map((tag) => (
        <span
          key={tag.code}
          className={`pill${tag.code === active ? " active" : ""}`}
          onClick={() => onChange(tag.code)}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
