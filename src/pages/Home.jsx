import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomePosts } from "../services/posts.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PostCard from "../components/PostCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Home() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getHomePosts()
      .then(setPosts)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{t("home.heroEyebrow")}</div>
          <h1>
            {t("home.heroHeadingPre")} <span className="italic-accent">{t("home.heroHeadingAccent")}</span>
            <br />
            {t("home.heroHeadingPost")}
          </h1>
          <p className="lead">{t("home.heroLead")}</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary">
              {t("home.ctaPrimary")}
            </Link>
            <Link to="/about" className="btn btn-outline">
              {t("home.ctaSecondary")}
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit"></div>
          <div className="hero-frame">
            <img src="/indexp.jpeg" alt="Leyla" />
          </div>
          <div className="hero-badge">{t("home.heroBadge")}</div>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="ic">📍</div>
          <div>
            <div className="label">{t("home.statLocationLabel")}</div>
            <div className="value">{t("home.statLocationValue")}</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">⌥</div>
          <div>
            <div className="label">{t("home.statFocusLabel")}</div>
            <div className="value">{t("home.statFocusValue")}</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">📖</div>
          <div>
            <div className="label">{t("home.statLearningLabel")}</div>
            <div className="value">{t("home.statLearningValue")}</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">✦</div>
          <div>
            <div className="label">{t("home.statAlwaysLabel")}</div>
            <div className="value">{t("home.statAlwaysValue")}</div>
          </div>
        </div>
      </section>

      <section className="blog-preview">
        <div className="section-head">
          <h2>{t("home.blogPreviewHeading")}</h2>
          <Link to="/blog" className="view-all">
            {t("home.allPosts")}
          </Link>
        </div>
        <div className="card-grid">
          {error && <EmptyState text={t("common.postsLoadError")} />}
          {!error && !posts && <LoadingState text={t("common.loadingArticles")} />}
          {!error && posts && posts.length === 0 && <EmptyState text={t("common.noPostsYet")} />}
          {!error && posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <section className="quote-block">
        <blockquote>"{t("home.quote")}"</blockquote>
        <div className="qimgs">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?q=80&w=300&auto=format&fit=crop"
            alt=""
          />
        </div>
      </section>
    </>
  );
}
