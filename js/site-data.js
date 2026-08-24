/* =========================================================
   Functions that fetch Firestore data for public pages and
   render it in the UI.
   ========================================================= */

function postCardHtml(id, post) {
  return `
    <a href="post.html?id=${id}" class="card">
      <img src="${escapeHtml(post.coverImage) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'}" alt="">
      <div class="card-body">
        <span class="card-tag">${escapeHtml(post.tag) || "General"}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt) || ""}</p>
        <div class="card-meta"><span>${formatDate(post.date)}</span><span>${escapeHtml(post.readTime) || "3 min"} read</span></div>
      </div>
    </a>`;
}

function emptyStateHtml(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

/* ---------- Home: latest 3 posts ---------- */
async function loadHomePosts() {
  const el = document.getElementById("home-posts");
  if (!el) return;
  try {
    const snap = await db.collection("posts").orderBy("date", "desc").limit(3).get();
    if (snap.empty) { el.innerHTML = emptyStateHtml("No posts yet. Add your first one from the admin panel."); return; }
    el.innerHTML = snap.docs.map(doc => postCardHtml(doc.id, doc.data())).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = emptyStateHtml("Posts could not be loaded. Check the Firebase connection.");
  }
}

/* ---------- Blog list: all posts + filters ---------- */
let ALL_POSTS = [];
async function loadBlogPosts() {
  const el = document.getElementById("blog-posts");
  if (!el) return;
  try {
    const snap = await db.collection("posts").orderBy("date", "desc").get();
    ALL_POSTS = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (ALL_POSTS.length === 0) { el.innerHTML = emptyStateHtml("No posts yet. Add your first one from the admin panel."); return; }
    renderBlogPosts("All");
    setupPillFilters();
  } catch (e) {
    console.error(e);
    el.innerHTML = emptyStateHtml("Posts could not be loaded. Check the Firebase connection.");
  }
}

function renderBlogPosts(tag) {
  const el = document.getElementById("blog-posts");
  const filtered = tag === "All" ? ALL_POSTS : ALL_POSTS.filter(p => p.tag === tag);
  el.innerHTML = filtered.length
    ? filtered.map(p => postCardHtml(p.id, p)).join("")
    : emptyStateHtml("No posts in this category.");
}

function setupPillFilters() {
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderBlogPosts(pill.dataset.tag);
    });
  });
}

/* ---------- Single post page ---------- */
async function loadSinglePost() {
  const el = document.getElementById("post-container");
  if (!el) return;
  const id = getQueryParam("id");
  if (!id) { el.innerHTML = emptyStateHtml("Post not found."); return; }
  try {
    const doc = await db.collection("posts").doc(id).get();
    if (!doc.exists) { el.innerHTML = emptyStateHtml("This post is no longer available."); return; }
    const post = doc.data();
    document.title = `${post.title} — Leyla`;
    el.innerHTML = `
      <div class="post-head">
        <div class="eyebrow">${escapeHtml(post.tag) || "General"}</div>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="post-meta">
          <span>Leyla</span><span>·</span>
          <span>${formatDate(post.date)}</span><span>·</span>
          <span>${escapeHtml(post.readTime) || "3 min"} read</span>
        </div>
      </div>
      ${post.coverImage ? `<div class="post-cover"><img src="${escapeHtml(post.coverImage)}" alt=""></div>` : ""}
      <article class="post-body">${paragraphsToHtml(post.content)}</article>
    `;
  } catch (e) {
    console.error(e);
    el.innerHTML = emptyStateHtml("The post could not be loaded.");
  }
}

/* ---------- Notes ---------- */
async function loadNotes() {
  const el = document.getElementById("notes-list");
  if (!el) return;
  try {
    const snap = await db.collection("notes").orderBy("date", "desc").get();
    if (snap.empty) { el.innerHTML = emptyStateHtml("No notes added yet."); return; }
    el.innerHTML = snap.docs.map(doc => {
      const n = doc.data();
      return `
        <div class="note-row">
          <div class="note-left">
            <div class="note-date">${formatDate(n.date)}</div>
            <div>
              <div class="note-title">${escapeHtml(n.title)}</div>
              ${n.excerpt ? `<div class="note-excerpt">${escapeHtml(n.excerpt)}</div>` : ""}
            </div>
          </div>
          <div class="note-arrow">→</div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = emptyStateHtml("Notes could not be loaded.");
  }
}

/* ---------- proje kısmı ---------- */
async function loadProjects() {
  const el = document.getElementById("project-grid");
  if (!el) return;
  try {
    const snap = await db.collection("projects").orderBy("createdAt", "desc").get();
    if (snap.empty) { el.innerHTML = emptyStateHtml("No projects added yet."); return; }
    el.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      const stack = (p.stack || []).map(s => `<span>${escapeHtml(s)}</span>`).join("");
      return `
        <div class="project-card">
          <img src="${escapeHtml(p.image) || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop'}" alt="">
          <div class="project-body">
            <span class="card-tag">${escapeHtml(p.tag) || "Project"}</span>
            <h3 style="font-size:20px;margin-top:10px;">${escapeHtml(p.title)}</h3>
            <p style="color:var(--text-dim);font-size:14px;margin-top:8px;">${escapeHtml(p.description) || ""}</p>
            <div class="stack">${stack}</div>
            <div class="project-links">
              ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener">Live preview →</a>` : ""}
              ${p.repoUrl ? `<a href="${escapeHtml(p.repoUrl)}" target="_blank" rel="noopener">Source code →</a>` : ""}
            </div>
          </div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = emptyStateHtml("Projects could not be loaded.");
  }
}
