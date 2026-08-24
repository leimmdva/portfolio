import { formatDate } from "../utils/format.js";
import { getLocalized } from "../utils/localized.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NoteRow({ note }) {
  const { lang } = useLanguage();
  const excerpt = getLocalized(note.excerpt, lang);

  return (
    <div className="note-row">
      <div className="note-left">
        <div className="note-date">{formatDate(note.date)}</div>
        <div>
          <div className="note-title">{getLocalized(note.title, lang)}</div>
          {excerpt && <div className="note-excerpt">{excerpt}</div>}
        </div>
      </div>
      <div className="note-arrow">→</div>
    </div>
  );
}
