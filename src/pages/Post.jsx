import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/posts.js";
import { formatDate } from "../utils/format.js";
import { getLocalized } from "../utils/localized.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PostBody from "../components/PostBody.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Post() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [post, setPost] = useState(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(undefined);
    getPost(id)
      .then(setPost)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, [id]);

  const title = post ? getLocalized(post.title, lang) : "";

  useEffect(() => {
    if (title) document.title = `${title} — Leyla`;
  }, [title]);

  if (error) return <EmptyState text={t("common.postLoadError")} />;
  if (post === undefined) return <LoadingState text={t("common.loadingPost")} />;
  if (post === null) return <EmptyState text={t("common.postUnavailable")} />;

  return (
    <>
      <div className="post-head">
        <div className="eyebrow">{post.tag ? t(`blog.tag${post.tag}`) : t("post.fallbackTag")}</div>
        <h1>{title}</h1>
        <div className="post-meta">
          <span>{t("post.byline")}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
      {post.coverImage && (
        <div className="post-cover">
          <img src={post.coverImage} alt="" />
        </div>
      )}
      <PostBody content={getLocalized(post.content, lang)} />
    </>
  );
}
