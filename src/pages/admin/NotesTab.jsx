import { useEffect, useState } from "react";
import { getNotes, addNote, updateNote, deleteNote } from "../../services/notes.js";
import { formatDate, todayStr } from "../../utils/format.js";
import { getLocalized, hasLocalizedValue } from "../../utils/localized.js";
import { DEFAULT_LANG } from "../../i18n/languages.js";
import LocalizedField from "../../components/admin/LocalizedField.jsx";

const emptyForm = { title: {}, excerpt: {}, date: todayStr() };

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
    setForm({ title: note.title || {}, excerpt: note.excerpt || {}, date: note.date || todayStr() });
    setFormOpen(true);
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setTitle = (v) => setForm((f) => ({ ...f, title: v }));
  const setExcerpt = (v) => setForm((f) => ({ ...f, excerpt: v }));

  const handleSave = async () => {
    if (!hasLocalizedValue(form.title)) {
      alert("Please write something.");
      return;
    }
    const data = { title: form.title, excerpt: form.excerpt, date: form.date || todayStr() };
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
                <div className="admin-row-title">{getLocalized(n.title, DEFAULT_LANG)}</div>
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
          <LocalizedField
            label="Note"
            value={form.title}
            onChange={setTitle}
            multiline
            rows={2}
            placeholder="A short thought..."
          />
          <LocalizedField label="Extra note (optional)" value={form.excerpt} onChange={setExcerpt} />
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
