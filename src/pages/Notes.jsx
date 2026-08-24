import { useEffect, useState } from "react";
import { getNotes } from "../services/notes.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import NoteRow from "../components/NoteRow.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Notes() {
  const { t } = useLanguage();
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
        <div className="eyebrow">{t("notes.eyebrow")}</div>
        <h1>
          {t("notes.title").replace(/\.$/, "")}
          <span className="italic-accent">.</span>
        </h1>
        <p>{t("notes.subhead")}</p>
      </div>

      <section className="notes-list">
        {error && <EmptyState text={t("common.notesLoadError")} />}
        {!error && !notes && <LoadingState text={t("common.loadingNotes")} />}
        {!error && notes && notes.length === 0 && <EmptyState text={t("common.noNotes")} />}
        {!error && notes && notes.map((note) => <NoteRow key={note.id} note={note} />)}
      </section>
    </>
  );
}
