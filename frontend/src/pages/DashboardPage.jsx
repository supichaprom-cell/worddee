import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function DashboardPage({ username, goWord }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/summary`);
      const data = await res.json();

      // Filter by username only
      const filtered = data.filter((r) => r.user === username);
      setRecords(filtered);

    } catch (err) {
      console.error("Failed to load summary:", err);
      setRecords([]);
    }

    setLoading(false);
  };

  // =========================================================
  // XP SYSTEM
  // =========================================================
  const xp = records.reduce(
    (sum, r) => sum + 10 + (r.score >= 80 ? 5 : 0),
    0
  );

  const level = Math.floor(xp / 100) + 1;

  // =========================================================
  // STREAK SYSTEM
  // =========================================================
  const dates = [...new Set(records.map((r) => r.date))].sort();
  let streak = 0;
  let cur = new Date().toISOString().slice(0, 10);

  while (dates.includes(cur)) {
    streak++;
    const d = new Date(cur);
    d.setDate(d.getDate() - 1);
    cur = d.toISOString().slice(0, 10);
  }

  // =========================================================
  // UI
  // =========================================================
  return (
    <section className="dashboard-section">
      <div className="dashboard-card">

        <h1 className="dash-title">{username}'s learner dashboard</h1>

        {/* ---------------------------------- */}
        {/* OVERVIEW */}
        {/* ---------------------------------- */}

        <h2 className="dash-subheading">Overview</h2>

        <div className="dash-overview">
          <div className="dash-overview-header">Learning summary</div>

          <div className="dash-overview-stats">
            <Stat icon="🔥" value={streak} label="Day streak" />
            <Stat icon="⭐" value={level} label="Level" />
            <Stat icon="⏱" value={xp} label="Total XP" />
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* MINI BAR GRAPH */}
        {/* ---------------------------------- */}

        <div className="dash-chart-card">
          <div className="dash-chart-header">Recent scores</div>

          <div className="dash-chart-body">
            {loading ? (
              <div className="dash-chart-placeholder">Loading…</div>
            ) : (
              <div className="dash-mini-chart">
                {(records.length === 0 ? [{ date: "None", score: 0 }] : records.slice(-10))
                  .map((r, i) => (
                  <div key={i} className="mini-bar-wrapper">
                    <div
                      className="mini-bar"
                      style={{ height: `${r.score || 5}%` }}
                    ></div>
                    <span className="mini-bar-label">
                      {r.date?.slice(5) || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="btn btn-primary dash-cta" onClick={goWord}>
          Take the test
        </button>
      </div>
    </section>
  );
}

// =========================================================
// STAT COMPONENT
// =========================================================

function Stat({ icon, value, label }) {
  return (
    <div className="dash-stat">
      <div className="dash-stat-icon">{icon}</div>
      <div>
        <div className="dash-stat-value">{value}</div>
        <div className="dash-stat-label">{label}</div>
      </div>
    </div>
  );
}
