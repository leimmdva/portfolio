import { useEffect, useState } from "react";
import { getMessages, markMessageRead, deleteMessage } from "../../services/messages.js";
import { formatDate } from "../../utils/format.js";

export default function MessagesTab({ onUnreadChange }) {
  const [messages, setMessages] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setMessages(null);
    getMessages()
      .then((msgs) => {
        setMessages(msgs);
        onUnreadChange(msgs.filter((m) => !m.read).length);
      })
      .catch((e) => {
        console.error(e);
        setLoadError(true);
      });
  };
  useEffect(load, []);

  const handleMarkRead = async (id) => {
    await markMessageRead(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await deleteMessage(id);
    load();
  };

  return (
    <section>
      <div className="admin-panel-head">
        <h2>Contact messages</h2>
      </div>
      <div className="admin-list">
        {loadError && <div className="admin-empty">Could not load messages.</div>}
        {!loadError && messages === null && <div className="admin-loading">Loading...</div>}
        {!loadError && messages && messages.length === 0 && <div className="admin-empty">No messages yet.</div>}
        {!loadError &&
          messages &&
          messages.map((m) => (
            <div className={`admin-row admin-message${m.read ? "" : " unread"}`} key={m.id}>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {m.name} <span className="admin-row-sub">— {m.email}</span>
                </div>
                {m.subject && (
                  <div className="admin-row-sub" style={{ marginTop: 4 }}>
                    {m.subject}
                  </div>
                )}
                <p className="admin-message-body">{m.message}</p>
                <div className="admin-row-sub" style={{ marginTop: 8 }}>
                  {formatDate(m.date)}
                </div>
              </div>
              <div className="admin-row-actions">
                {!m.read && (
                  <button className="icon-action" onClick={() => handleMarkRead(m.id)}>
                    Mark as read
                  </button>
                )}
                <button className="icon-action danger" onClick={() => handleDelete(m.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
