import { useState } from "react";

export default function LoginPage({ goRegister, onLogin, userSystem }) {
  const { login } = userSystem;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    const res = login(username, password);

    if (!res.ok) {
      alert(res.message);
      return;
    }

    // Login success → move to WordPage
    onLogin();
  };

  return (
    <section className="word-page">
      <div className="hero-bg">

        <div className="card" style={{ maxWidth: 420 }}>
          <h1 className="wod-title">Welcome back 👋</h1>
          <p className="wod-subtitle">Log in to continue learning</p>

          <input
            className="wod-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="wod-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: 10 }}
          />

          <div className="wod-actions" style={{ justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 14 }}>
            Don't have an account?{" "}
            <button
              onClick={goRegister}
              style={{
                background: "none",
                border: "none",
                color: "#0073b6",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Create one
            </button>
          </p>
        </div>

      </div>
    </section>
  );
}
