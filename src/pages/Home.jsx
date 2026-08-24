import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomePosts } from "../services/posts.js";
import PostCard from "../components/PostCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Home() {
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
          <div className="eyebrow">Mobile &amp; Web Developer · Eskişehir</div>
          <h1>
            Building thoughtful <span className="italic-accent">products</span>
            <br />
            from idea to launch.
          </h1>
          <p className="lead">
            I'm Leyla, a software developer who works across Flutter and Node.js — shaping
            architecture on one side and crafting the details of an experience on the other. Here
            you'll find my projects, my writing, and the notes I keep along the way.
          </p>
          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary">
              See my work →
            </Link>
            <Link to="/about" className="btn btn-outline">
              About me
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit"></div>
          <div className="hero-frame">
            <img src="/indexp.jpeg" alt="Leyla" />
          </div>
          <div className="hero-badge">BUILD · SHIP · REFLECT</div>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="ic">📍</div>
          <div>
            <div className="label">Location</div>
            <div className="value">Eskişehir, TR</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">⌥</div>
          <div>
            <div className="label">Focus</div>
            <div className="value">Mobile &amp; Web</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">📖</div>
          <div>
            <div className="label">Currently learning</div>
            <div className="value">Flutter &amp; Node.js</div>
          </div>
        </div>
        <div className="stat">
          <div className="ic">✦</div>
          <div>
            <div className="label">Always</div>
            <div className="value">Curious, evolving</div>
          </div>
        </div>
      </section>

      <section className="blog-preview">
        <div className="section-head">
          <h2>Latest from the blog ✦</h2>
          <Link to="/blog" className="view-all">
            All posts →
          </Link>
        </div>
        <div className="card-grid">
          {error && <EmptyState text="Posts could not be loaded. Check the Firebase connection." />}
          {!error && !posts && <LoadingState text="Loading articles..." />}
          {!error && posts && posts.length === 0 && (
            <EmptyState text="No posts yet. Add your first one from the admin panel." />
          )}
          {!error && posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <section className="quote-block">
        <blockquote>"We are all stars, we are just looking for our place in the sky."</blockquote>
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
