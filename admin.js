/* =========================================================
   Admin Panel — login, CRUD, and tab management
   ========================================================= */

const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");

/* ---------------- AUTH ---------------- */

auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadPosts();
    loadNotesAdmin();
    loadProjectsAdmin();
    loadMessages();
  } else {
    loginScreen.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    errorEl.textContent = "Login failed: email or password is incorrect.";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => auth.signOut());

/* ---------------- TAB MANAGEMENT ---------------- */

document.querySelectorAll(".admin-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-tab-panel").forEach(p => p.classList.add("hidden"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.remove("hidden");
  });
});

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/* =========================================================
   POSTS
   ========================================================= */

const postFormPanel = document.getElementById("post-form-panel");

document.getElementById("new-post-btn").addEventListener("click", () => {
  resetPostForm();
  postFormPanel.classList.remove("hidden");
});
document.getElementById("cancel-post-btn").addEventListener("click", () => postFormPanel.classList.add("hidden"));

function resetPostForm() {
  document.getElementById("post-form-title").textContent = "New post";
  document.getElementById("post-id").value = "";
  document.getElementById("post-title").value = "";
  document.getElementById("post-tag").value = "Life";
  document.getElementById("post-readtime").value = "";
  document.getElementById("post-excerpt").value = "";
  document.getElementById("post-cover").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("post-date").value = todayStr();
}

document.getElementById("save-post-btn").addEventListener("click", async () => {
  const id = document.getElementById("post-id").value;
  const title = document.getElementById("post-title").value.trim();
  if (!title) { alert("Please enter a title."); return; }

  const data = {
    title,
    tag: document.getElementById("post-tag").value,
    readTime: document.getElementById("post-readtime").value.trim() || "3 min",
    excerpt: document.getElementById("post-excerpt").value.trim(),
    coverImage: document.getElementById("post-cover").value.trim(),
    content: document.getElementById("post-content").value,
    date: document.getElementById("post-date").value || todayStr()
  };

  try {
    if (id) await db.collection("posts").doc(id).update(data);
    else await db.collection("posts").add(data);
    postFormPanel.classList.add("hidden");
    loadPosts();
  } catch (e) {
    console.error(e);
    alert("Could not save: " + e.message);
  }
});

async function loadPosts() {
  const el = document.getElementById("posts-table");
  el.innerHTML = `<div class="admin-loading">Loading...</div>`;
  try {
    const snap = await db.collection("posts").orderBy("date", "desc").get();
    if (snap.empty) { el.innerHTML = `<div class="admin-empty">No posts yet. Add one with "New post".</div>`; return; }
    el.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      return `
        <div class="admin-row">
          <div class="admin-row-main">
            <span class="admin-row-tag">${escapeHtml(p.tag)}</span>
            <div class="admin-row-title">${escapeHtml(p.title)}</div>
            <div class="admin-row-sub">${formatDate(p.date)} · ${escapeHtml(p.readTime)}</div>
          </div>
          <div class="admin-row-actions">
            <button class="icon-action" onclick="editPost('${doc.id}')">Edit</button>
            <button class="icon-action danger" onclick="deletePost('${doc.id}')">Delete</button>
          </div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="admin-empty">Could not load: ${escapeHtml(e.message)}</div>`;
  }
}

async function editPost(id) {
  const doc = await db.collection("posts").doc(id).get();
  const p = doc.data();
  document.getElementById("post-form-title").textContent = "Edit post";
  document.getElementById("post-id").value = id;
  document.getElementById("post-title").value = p.title || "";
  document.getElementById("post-tag").value = p.tag || "Life";
  document.getElementById("post-readtime").value = p.readTime || "";
  document.getElementById("post-excerpt").value = p.excerpt || "";
  document.getElementById("post-cover").value = p.coverImage || "";
  document.getElementById("post-content").value = p.content || "";
  document.getElementById("post-date").value = p.date || todayStr();
  postFormPanel.classList.remove("hidden");
  postFormPanel.scrollIntoView({ behavior: "smooth" });
}

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  await db.collection("posts").doc(id).delete();
  loadPosts();
}

/* =========================================================
   NOTES
   ========================================================= */

const noteFormPanel = document.getElementById("note-form-panel");

document.getElementById("new-note-btn").addEventListener("click", () => {
  resetNoteForm();
  noteFormPanel.classList.remove("hidden");
});
document.getElementById("cancel-note-btn").addEventListener("click", () => noteFormPanel.classList.add("hidden"));

function resetNoteForm() {
  document.getElementById("note-form-title").textContent = "New note";
  document.getElementById("note-id").value = "";
  document.getElementById("note-title").value = "";
  document.getElementById("note-excerpt").value = "";
  document.getElementById("note-date").value = todayStr();
}

document.getElementById("save-note-btn").addEventListener("click", async () => {
  const id = document.getElementById("note-id").value;
  const title = document.getElementById("note-title").value.trim();
  if (!title) { alert("Please write something."); return; }

  const data = {
    title,
    excerpt: document.getElementById("note-excerpt").value.trim(),
    date: document.getElementById("note-date").value || todayStr()
  };

  try {
    if (id) await db.collection("notes").doc(id).update(data);
    else await db.collection("notes").add(data);
    noteFormPanel.classList.add("hidden");
    loadNotesAdmin();
  } catch (e) {
    console.error(e);
    alert("Could not save: " + e.message);
  }
});

async function loadNotesAdmin() {
  const el = document.getElementById("notes-table");
  el.innerHTML = `<div class="admin-loading">Loading...</div>`;
  try {
    const snap = await db.collection("notes").orderBy("date", "desc").get();
    if (snap.empty) { el.innerHTML = `<div class="admin-empty">No notes yet.</div>`; return; }
    el.innerHTML = snap.docs.map(doc => {
      const n = doc.data();
      return `
        <div class="admin-row">
          <div class="admin-row-main">
            <div class="admin-row-title">${escapeHtml(n.title)}</div>
            <div class="admin-row-sub">${formatDate(n.date)}</div>
          </div>
          <div class="admin-row-actions">
            <button class="icon-action" onclick="editNote('${doc.id}')">Edit</button>
            <button class="icon-action danger" onclick="deleteNote('${doc.id}')">Delete</button>
          </div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="admin-empty">Could not load: ${escapeHtml(e.message)}</div>`;
  }
}

async function editNote(id) {
  const doc = await db.collection("notes").doc(id).get();
  const n = doc.data();
  document.getElementById("note-form-title").textContent = "Edit note";
  document.getElementById("note-id").value = id;
  document.getElementById("note-title").value = n.title || "";
  document.getElementById("note-excerpt").value = n.excerpt || "";
  document.getElementById("note-date").value = n.date || todayStr();
  noteFormPanel.classList.remove("hidden");
  noteFormPanel.scrollIntoView({ behavior: "smooth" });
}

async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  await db.collection("notes").doc(id).delete();
  loadNotesAdmin();
}

/* =========================================================
   PROJECTS
   ========================================================= */

const projectFormPanel = document.getElementById("project-form-panel");

document.getElementById("new-project-btn").addEventListener("click", () => {
  resetProjectForm();
  projectFormPanel.classList.remove("hidden");
});
document.getElementById("cancel-project-btn").addEventListener("click", () => projectFormPanel.classList.add("hidden"));

function resetProjectForm() {
  document.getElementById("project-form-title").textContent = "New project";
  document.getElementById("project-id").value = "";
  document.getElementById("project-title").value = "";
  document.getElementById("project-tag").value = "";
  document.getElementById("project-image").value = "";
  document.getElementById("project-description").value = "";
  document.getElementById("project-stack").value = "";
  document.getElementById("project-live").value = "";
  document.getElementById("project-repo").value = "";
}

document.getElementById("save-project-btn").addEventListener("click", async () => {
  const id = document.getElementById("project-id").value;
  const title = document.getElementById("project-title").value.trim();
  if (!title) { alert("Please enter a title."); return; }

  const data = {
    title,
    tag: document.getElementById("project-tag").value.trim(),
    image: document.getElementById("project-image").value.trim(),
    description: document.getElementById("project-description").value.trim(),
    stack: document.getElementById("project-stack").value.split(",").map(s => s.trim()).filter(Boolean),
    liveUrl: document.getElementById("project-live").value.trim(),
    repoUrl: document.getElementById("project-repo").value.trim()
  };

  try {
    if (id) {
      await db.collection("projects").doc(id).update(data);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection("projects").add(data);
    }
    projectFormPanel.classList.add("hidden");
    loadProjectsAdmin();
  } catch (e) {
    console.error(e);
    alert("Could not save: " + e.message);
  }
});

async function loadProjectsAdmin() {
  const el = document.getElementById("projects-table");
  el.innerHTML = `<div class="admin-loading">Loading...</div>`;
  try {
    const snap = await db.collection("projects").orderBy("createdAt", "desc").get();
    if (snap.empty) { el.innerHTML = `<div class="admin-empty">No projects yet.</div>`; return; }
    el.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      return `
        <div class="admin-row">
          <div class="admin-row-main">
            <span class="admin-row-tag">${escapeHtml(p.tag) || "Project"}</span>
            <div class="admin-row-title">${escapeHtml(p.title)}</div>
            <div class="admin-row-sub">${(p.stack || []).join(", ")}</div>
          </div>
          <div class="admin-row-actions">
            <button class="icon-action" onclick="editProject('${doc.id}')">Edit</button>
            <button class="icon-action danger" onclick="deleteProject('${doc.id}')">Delete</button>
          </div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="admin-empty">Could not load: ${escapeHtml(e.message)}</div>`;
  }
}

async function editProject(id) {
  const doc = await db.collection("projects").doc(id).get();
  const p = doc.data();
  document.getElementById("project-form-title").textContent = "Edit project";
  document.getElementById("project-id").value = id;
  document.getElementById("project-title").value = p.title || "";
  document.getElementById("project-tag").value = p.tag || "";
  document.getElementById("project-image").value = p.image || "";
  document.getElementById("project-description").value = p.description || "";
  document.getElementById("project-stack").value = (p.stack || []).join(", ");
  document.getElementById("project-live").value = p.liveUrl || "";
  document.getElementById("project-repo").value = p.repoUrl || "";
  projectFormPanel.classList.remove("hidden");
  projectFormPanel.scrollIntoView({ behavior: "smooth" });
}

async function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  await db.collection("projects").doc(id).delete();
  loadProjectsAdmin();
}

/* =========================================================
   MESSAGES
   ========================================================= */

async function loadMessages() {
  const el = document.getElementById("messages-list");
  el.innerHTML = `<div class="admin-loading">Loading...</div>`;
  try {
    const snap = await db.collection("messages").orderBy("date", "desc").get();
    const badge = document.getElementById("msg-badge");
    const unread = snap.docs.filter(d => !d.data().read).length;
    if (unread > 0) { badge.textContent = unread; badge.classList.remove("hidden"); }
    else { badge.classList.add("hidden"); }

    if (snap.empty) { el.innerHTML = `<div class="admin-empty">No messages yet.</div>`; return; }

    el.innerHTML = snap.docs.map(doc => {
      const m = doc.data();
      return `
        <div class="admin-row admin-message ${m.read ? "" : "unread"}">
          <div class="admin-row-main">
            <div class="admin-row-title">${escapeHtml(m.name)} <span class="admin-row-sub">— ${escapeHtml(m.email)}</span></div>
            ${m.subject ? `<div class="admin-row-sub" style="margin-top:4px;">${escapeHtml(m.subject)}</div>` : ""}
            <p class="admin-message-body">${escapeHtml(m.message)}</p>
            <div class="admin-row-sub" style="margin-top:8px;">${formatDate(m.date)}</div>
          </div>
          <div class="admin-row-actions">
            ${m.read ? "" : `<button class="icon-action" onclick="markRead('${doc.id}')">Mark as read</button>`}
            <button class="icon-action danger" onclick="deleteMessage('${doc.id}')">Delete</button>
          </div>
        </div>`;
    }).join("");
  } catch (e) {
    console.error(e);
    el.innerHTML = `<div class="admin-empty">Could not load: ${escapeHtml(e.message)}</div>`;
  }
}

async function markRead(id) {
  await db.collection("messages").doc(id).update({ read: true });
  loadMessages();
}

async function deleteMessage(id) {
  if (!confirm("Are you sure you want to delete this message?")) return;
  await db.collection("messages").doc(id).delete();
  loadMessages();
}
