import { useEffect, useState } from "react";
import { getNotes } from "../services/notes.js";
import NoteRow from "../components/NoteRow.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Notes() {
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Short thoughts</div>
        <h1>
          Notes<span className="italic-accent">.</span>
        </h1>
        <p>Small reflections from building and shipping — not full essays, but worth sharing.</p>
      </div>

      <section className="notes-list">
        {error && <EmptyState text="Notes could not be loaded." />}
        {!error && !notes && <LoadingState text="Loading notes..." />}
        {!error && notes && notes.length === 0 && <EmptyState text="No notes added yet." />}
        {!error && notes && notes.map((note) => <NoteRow key={note.id} note={note} />)}
      </section>
    </>
  );
}
