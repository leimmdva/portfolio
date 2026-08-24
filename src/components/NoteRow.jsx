import { formatDate } from "../utils/format.js";

export default function NoteRow({ note }) {
  return (
    <div className="note-row">
      <div className="note-left">
        <div className="note-date">{formatDate(note.date)}</div>
        <div>
          <div className="note-title">{note.title}</div>
          {note.excerpt && <div className="note-excerpt">{note.excerpt}</div>}
        </div>
      </div>
      <div className="note-arrow">→</div>
    </div>
  );
}
