import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import PostsTab from "./PostsTab.jsx";
import NotesTab from "./NotesTab.jsx";
import ProjectsTab from "./ProjectsTab.jsx";
import MessagesTab from "./MessagesTab.jsx";

const TABS = [
  { key: "posts", label: "✎ Posts" },
  { key: "notes", label: "✦ Notes" },
  { key: "projects", label: "▣ Projects" },
  { key: "messages", label: "✉ Messages" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const [tab, setTab] = useState("posts");
  const [unread, setUnread] = useState(0);

  return (
    <div className="dashboard">
      <aside className="admin-sidebar">
        <div className="logo" style={{ marginBottom: 36 }}>
          Leyla <span>+</span>
        </div>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab-btn${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === "messages" && unread > 0 && <span className="badge">{unread}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/" target="_blank" className="admin-view-site">
            View site ↗
          </Link>
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "posts" && <PostsTab />}
        {tab === "notes" && <NotesTab />}
        {tab === "projects" && <ProjectsTab />}
        {tab === "messages" && <MessagesTab onUnreadChange={setUnread} />}
      </main>
    </div>
  );
}
