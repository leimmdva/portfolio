import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.js";
import PostCard from "../components/PostCard.jsx";
import TagFilter from "../components/TagFilter.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Blog() {
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

  const filtered = posts && (activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag));

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Writing</div>
        <h1>
          Blog<span className="italic-accent">.</span>
        </h1>
        <p>Notes on the products I build, the tools I use, and everything in between.</p>
      </div>

      {posts && posts.length > 0 && <TagFilter active={activeTag} onChange={setActiveTag} />}

      <section className="card-grid" style={{ paddingBottom: 80 }}>
        {error && <EmptyState text="Posts could not be loaded. Check the Firebase connection." />}
        {!error && !posts && <LoadingState text="Loading articles..." />}
        {!error && posts && posts.length === 0 && (
          <EmptyState text="No posts yet. Add your first one from the admin panel." />
        )}
        {!error && filtered && filtered.length === 0 && posts.length > 0 && (
          <EmptyState text="No posts in this category." />
        )}
        {!error && filtered && filtered.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </>
  );
}
