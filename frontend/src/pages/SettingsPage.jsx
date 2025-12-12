import { useState } from "react";

export default function SettingsPage({ userSystem, goBack }) {
  const { currentUser, changeUsername, users, avatar } = userSystem;

  const [newName, setNewName] = useState("");

  const handleChange = () => {
    if (!newName.trim()) {
      alert("Please enter a new username.");
      return;
    }

    const res = changeUsername(newName.trim());

    if (!res.ok) {
      alert(res.message);
      return;
    }

    alert("Username updated!");
    goBack(); // Return to Dashboard
  };

  return (
    <section className="word-page">
      <div className="hero-bg">

        <div className="card" style={{ maxWidth: 450 }}>
          <h1 className="wod-title">Account Settings</h1>
          <p className="wod-subtitle">Manage your profile information</p>

          {/* Avatar display */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#e0f2fe",
              border: "3px solid #0ea5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#0369a1",
              margin: "10px auto 20px",
            }}
          >
            {avatar}
          </div>

          <p style={{ textAlign: "center", fontSize: 14 }}>
            Current username: <strong>{currentUser}</strong>
          </p>

          <input
            className="wod-input"
            placeholder="Enter new username..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginTop: 16 }}
          />

          <div className="wod-actions" style={{ marginTop: 18 }}>
            <button className="btn btn-ghost" onClick={goBack}>
              Back
            </button>

            <button className="btn btn-primary" onClick={handleChange}>
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
