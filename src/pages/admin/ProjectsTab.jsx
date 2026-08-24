import { useEffect, useState } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../../services/projects.js";
import { getLocalized, hasLocalizedValue } from "../../utils/localized.js";
import { DEFAULT_LANG } from "../../i18n/languages.js";
import ImageField from "../../components/admin/ImageField.jsx";
import LocalizedField from "../../components/admin/LocalizedField.jsx";

const emptyForm = { title: {}, tag: "", image: "", description: {}, stack: "", liveUrl: "", repoUrl: "" };

export default function ProjectsTab() {
  const [projects, setProjects] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setProjects(null);
    getProjects()
      .then(setProjects)
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

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || {},
      tag: p.tag || "",
      image: p.image || "",
      description: p.description || {},
      stack: (p.stack || []).join(", "),
      liveUrl: p.liveUrl || "",
      repoUrl: p.repoUrl || "",
    });
    setFormOpen(true);
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setImage = (v) => setForm((f) => ({ ...f, image: v }));
  const setTitle = (v) => setForm((f) => ({ ...f, title: v }));
  const setDescription = (v) => setForm((f) => ({ ...f, description: v }));

  const handleSave = async () => {
    if (!hasLocalizedValue(form.title)) {
      alert("Please enter a title.");
      return;
    }
    const data = {
      title: form.title,
      tag: form.tag.trim(),
      image: form.image.trim(),
      description: form.description,
      stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: form.liveUrl.trim(),
      repoUrl: form.repoUrl.trim(),
    };
    setSaving(true);
    try {
      if (editingId) await updateProject(editingId, data);
      else await addProject(data);
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deleteProject(id);
    load();
  };

  return (
    <section>
      <div className="admin-panel-head">
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + New project
        </button>
      </div>

      <div className="admin-list">
        {loadError && <div className="admin-empty">Could not load projects.</div>}
        {!loadError && projects === null && <div className="admin-loading">Loading...</div>}
        {!loadError && projects && projects.length === 0 && <div className="admin-empty">No projects yet.</div>}
        {!loadError &&
          projects &&
          projects.map((p) => (
            <div className="admin-row" key={p.id}>
              <div className="admin-row-main">
                <span className="admin-row-tag">{p.tag || "Project"}</span>
                <div className="admin-row-title">{getLocalized(p.title, DEFAULT_LANG)}</div>
                <div className="admin-row-sub">{(p.stack || []).join(", ")}</div>
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
          <h3>{editingId ? "Edit project" : "New project"}</h3>
          <LocalizedField label="Title" value={form.title} onChange={setTitle} />
          <div className="field">
            <label>Category</label>
            <input type="text" placeholder="Mobile App" value={form.tag} onChange={update("tag")} />
          </div>
          <ImageField label="Project image" value={form.image} onChange={setImage} />
          <LocalizedField label="Description" value={form.description} onChange={setDescription} multiline rows={3} />
          <div className="field">
            <label>Technologies (comma-separated)</label>
            <input
              type="text"
              placeholder="Flutter, Firebase, Riverpod"
              value={form.stack}
              onChange={update("stack")}
            />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Live preview URL</label>
              <input type="text" placeholder="https://..." value={form.liveUrl} onChange={update("liveUrl")} />
            </div>
            <div className="field">
              <label>Source code URL</label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={form.repoUrl}
                onChange={update("repoUrl")}
              />
            </div>
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
