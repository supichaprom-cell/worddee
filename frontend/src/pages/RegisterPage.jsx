import { useState } from "react";

export default function RegisterPage({ userSystem, goLogin, onRegister }) {
  const { register } = userSystem;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!username.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const res = register(username.trim(), password);

    if (!res.ok) {
      alert(res.message);
      return;
    }

    // Registration successful → go to WordPage
    onRegister();
  };

  return (
    <section className="word-page">
      <div className="hero-bg">

        <div className="card" style={{ maxWidth: 420 }}>
          <h1 className="wod-title">Create your account</h1>
          <p className="wod-subtitle">Join worddee.ai today 🎉</p>

          <input
            className="wod-input"
            placeholder="Choose a username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="wod-input"
            type="password"
            placeholder="Choose a password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: 10 }}
          />

          <div className="wod-actions" style={{ justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleRegister}>
              Create account
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 14 }}>
            Already have an account?{" "}
            <button
              onClick={goLogin}
              style={{
                background: "none",
                border: "none",
                color: "#0073b6",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Login
            </button>
          </p>
        </div>

      </div>
    </section>
  );
}
