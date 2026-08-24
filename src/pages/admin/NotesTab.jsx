import { useEffect, useState } from "react";
import { getNotes, addNote, updateNote, deleteNote } from "../../services/notes.js";
import { formatDate, todayStr } from "../../utils/format.js";

const emptyForm = { title: "", excerpt: "", date: todayStr() };

export default function NotesTab() {
  const [notes, setNotes] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setNotes(null);
    getNotes()
      .then(setNotes)
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

  const openEdit = (note) => {
    setEditingId(note.id);
    setForm({ title: note.title || "", excerpt: note.excerpt || "", date: note.date || todayStr() });
    setFormOpen(true);
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Please write something.");
      return;
    }
    const data = { title: form.title.trim(), excerpt: form.excerpt.trim(), date: form.date || todayStr() };
    setSaving(true);
    try {
      if (editingId) await updateNote(editingId, data);
      else await addNote(data);
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
    if (!confirm("Are you sure you want to delete this note?")) return;
    await deleteNote(id);
    load();
  };

  return (
    <section>
      <div className="admin-panel-head">
        <h2>Notes</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + New note
        </button>
      </div>

      <div className="admin-list">
        {loadError && <div className="admin-empty">Could not load notes.</div>}
        {!loadError && notes === null && <div className="admin-loading">Loading...</div>}
        {!loadError && notes && notes.length === 0 && <div className="admin-empty">No notes yet.</div>}
        {!loadError &&
          notes &&
          notes.map((n) => (
            <div className="admin-row" key={n.id}>
              <div className="admin-row-main">
                <div className="admin-row-title">{n.title}</div>
                <div className="admin-row-sub">{formatDate(n.date)}</div>
              </div>
              <div className="admin-row-actions">
                <button className="icon-action" onClick={() => openEdit(n)}>
                  Edit
                </button>
                <button className="icon-action danger" onClick={() => handleDelete(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {formOpen && (
        <div className="admin-form-panel">
          <h3>{editingId ? "Edit note" : "New note"}</h3>
          <div className="field">
            <label>Note</label>
            <textarea rows={2} placeholder="A short thought..." value={form.title} onChange={update("title")} />
          </div>
          <div className="field">
            <label>Extra note (optional)</label>
            <input type="text" value={form.excerpt} onChange={update("excerpt")} />
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
