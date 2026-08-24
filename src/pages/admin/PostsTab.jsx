import { useEffect, useState } from "react";
import { getAllPosts, addPost, updatePost, deletePost } from "../../services/posts.js";
import { formatDate, todayStr } from "../../utils/format.js";
import ImageField from "../../components/admin/ImageField.jsx";

const TAGS = ["Life", "Technology", "Thoughts", "Projects"];
const emptyForm = { title: "", tag: "Life", excerpt: "", coverImage: "", content: "", date: todayStr() };

export default function PostsTab() {
  const [posts, setPosts] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setPosts(null);
    getAllPosts()
      .then(setPosts)
      .catch((e) => {
        console.error(e);
        setLoadError(true);
      });
  };
  useEffect(load, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      tag: post.tag || "Life",
      excerpt: post.excerpt || "",
      coverImage: post.coverImage || "",
      content: post.content || "",
      date: post.date || todayStr(),
    });
    setFormOpen(true);
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setCoverImage = (v) => setForm((f) => ({ ...f, coverImage: v }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }
    const data = {
      title: form.title.trim(),
      tag: form.tag,
      excerpt: form.excerpt.trim(),
      coverImage: form.coverImage.trim(),
      content: form.content,
      date: form.date || todayStr(),
    };
    setSaving(true);
    try {
      if (editingId) await updatePost(editingId, data);
      else await addPost(data);
      setFormOpen(false);
      load();
    } catch (e) {
      console.error(e);
      alert("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await deletePost(id);
    load();
  };

  return (
    <section>
      <div className="admin-panel-head">
        <h2>Posts</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + New post
        </button>
      </div>

      <div className="admin-list">
        {loadError && <div className="admin-empty">Could not load posts.</div>}
        {!loadError && posts === null && <div className="admin-loading">Loading...</div>}
        {!loadError && posts && posts.length === 0 && (
          <div className="admin-empty">No posts yet. Add one with "New post".</div>
        )}
        {!loadError &&
          posts &&
          posts.map((p) => (
            <div className="admin-row" key={p.id}>
              <div className="admin-row-main">
                <span className="admin-row-tag">{p.tag}</span>
                <div className="admin-row-title">{p.title}</div>
                <div className="admin-row-sub">{formatDate(p.date)}</div>
              </div>
              <div className="admin-row-actions">
                <button className="icon-action" onClick={() => openEdit(p)}>
                  Edit
                </button>
                <button className="icon-action danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {formOpen && (
        <div className="admin-form-panel">
          <h3>{editingId ? "Edit post" : "New post"}</h3>
          <div className="field">
            <label>Title</label>
            <input type="text" placeholder="Post title" value={form.title} onChange={update("title")} />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.tag} onChange={update("tag")}>
              {TAGS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Excerpt</label>
            <input
              type="text"
              placeholder="Short summary shown on the card"
              value={form.excerpt}
              onChange={update("excerpt")}
            />
          </div>
          <ImageField label="Cover image" value={form.coverImage} onChange={setCoverImage} />
          <div className="field">
            <label>Content</label>
            <textarea
              rows={10}
              placeholder="Separate paragraphs with a blank line"
              value={form.content}
              onChange={update("content")}
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={update("date")} />
          </div>
          <div className="admin-form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              Save
            </button>
            <button className="btn btn-outline" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
