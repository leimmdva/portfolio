import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
    } catch (e) {
      setError("Login failed: email or password is incorrect.");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="logo" style={{ fontSize: 28, marginBottom: 6 }}>
          Leyla <span>+</span>
        </div>
        <p style={{ color: "var(--text-faint)", fontSize: 13, marginBottom: 26 }}>Welcome to the admin panel</p>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="hello@leyla.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          onClick={handleLogin}
        >
          Log in →
        </button>
        {error && (
          <div className="form-status error" style={{ marginTop: 14 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
