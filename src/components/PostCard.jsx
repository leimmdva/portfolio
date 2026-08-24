import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop";

export default function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} className="card">
      <img src={post.coverImage || FALLBACK_COVER} alt="" />
      <div className="card-body">
        <span className="card-tag">{post.tag || "General"}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt || ""}</p>
        <div className="card-meta">
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}
