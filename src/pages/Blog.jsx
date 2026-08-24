import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PostCard from "../components/PostCard.jsx";
import TagFilter from "../components/TagFilter.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TAG_CODES = ["All", "Life", "Technology", "Thoughts", "Projects"];

export default function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  const tags = TAG_CODES.map((code) => ({ code, label: t(`blog.tag${code}`) }));
  const filtered = posts && (activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag));

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">{t("blog.eyebrow")}</div>
        <h1>
          {t("blog.title").replace(/\.$/, "")}
          <span className="italic-accent">.</span>
        </h1>
        <p>{t("blog.subhead")}</p>
      </div>

      {posts && posts.length > 0 && <TagFilter tags={tags} active={activeTag} onChange={setActiveTag} />}

      <section className="card-grid" style={{ paddingBottom: 80 }}>
        {error && <EmptyState text={t("common.postsLoadError")} />}
        {!error && !posts && <LoadingState text={t("common.loadingArticles")} />}
        {!error && posts && posts.length === 0 && <EmptyState text={t("common.noPostsYet")} />}
        {!error && filtered && filtered.length === 0 && posts.length > 0 && (
          <EmptyState text={t("common.noPostsInCategory")} />
        )}
        {!error && filtered && filtered.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </>
  );
}
