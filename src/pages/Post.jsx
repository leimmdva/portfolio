import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/posts.js";
import { formatDate } from "../utils/format.js";
import PostBody from "../components/PostBody.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Post() {
  const { id } = useParams();
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

  useEffect(() => {
    if (post) document.title = `${post.title} — Leyla`;
  }, [post]);

  if (error) return <EmptyState text="The post could not be loaded." />;
  if (post === undefined) return <LoadingState text="Loading post..." />;
  if (post === null) return <EmptyState text="This post is no longer available." />;

  return (
    <>
      <div className="post-head">
        <div className="eyebrow">{post.tag || "General"}</div>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>Leyla</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
      {post.coverImage && (
        <div className="post-cover">
          <img src={post.coverImage} alt="" />
        </div>
      )}
      <PostBody content={post.content} />
    </>
  );
}
