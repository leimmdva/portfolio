export default function PostBody({ content }) {
  if (!content) return null;
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <article className="post-body">
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.trim().split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </article>
  );
}
