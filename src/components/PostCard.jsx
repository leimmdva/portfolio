import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";
import { getLocalized } from "../utils/localized.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop";

export default function PostCard({ post }) {
  const { lang, t } = useLanguage();

  return (
    <Link to={`/blog/${post.id}`} className="card">
      <img src={post.coverImage || FALLBACK_COVER} alt="" />
      <div className="card-body">
        <span className="card-tag">{post.tag ? t(`blog.tag${post.tag}`) : t("post.fallbackTag")}</span>
        <h3>{getLocalized(post.title, lang)}</h3>
        <p>{getLocalized(post.excerpt, lang)}</p>
        <div className="card-meta">
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}
