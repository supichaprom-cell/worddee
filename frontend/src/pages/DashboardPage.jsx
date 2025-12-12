import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function DashboardPage({ username, goWord }) {
  const [summary, setSummary] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    try {
      const sres = await fetch(`${API_BASE}/user/${username}/summary`);
      setSummary(await sres.json());

      const hres = await fetch(`${API_BASE}/user/${username}/scores`);
      setScores(await hres.json());
    } catch (err) {
      console.error("Dashboard error:", err);
    }
    setLoading(false);
  };

  if (loading || !summary) {
    return (
      <section className="dashboard-section">
        <div className="dashboard-card">
          <div className="dash-chart-placeholder">Loading dashboard…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-card">

        {/* TITLE */}
        <h1 className="dash-title">{username}'s learner dashboard</h1>

        {/* SUMMARY BOX */}
        <h2 className="dash-subheading">Overview</h2>

        <div className="dash-overview">
          <div className="dash-overview-header">Learning summary</div>

          <div className="dash-overview-stats">
            <Stat icon="🔥" value={summary.day_streak} label="Day streak" />
            <Stat icon="⭐" value={summary.level} label="Level" />
            <Stat icon="⏱" value={summary.total_xp} label="Total XP" />
          </div>
        </div>

        {/* RECENT SCORES */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">Recent scores</div>

          {scores.length === 0 ? (
            <div className="dash-chart-placeholder">No test data yet</div>
          ) : (
            <div className="dash-score-list">

              {scores.slice(0, 10).map((s, i) => (
                <div key={i} className="score-card">
                  
                  <div className="score-row">
                    <span className="score-ico">📅</span>
                    <span className="score-label">Date:</span>
                    <span>{s.date}</span>
                  </div>

                  <div className="score-row">
                    <span className="score-ico">🔤</span>
                    <span className="score-label">Word:</span>
                    <span>{s.word}</span>
                  </div>

                  <div className="score-row">
                    <span className="score-ico">✏️</span>
                    <span className="score-label">Sentence:</span>
                    <span>{s.sentence || "—"}</span>
                  </div>

                  <div className="score-row">
                    <span className="score-ico">⭐</span>
                    <span className="score-label">Score:</span>
                    <span>{s.score}</span>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

        <button className="btn btn-primary dash-cta" onClick={goWord}>
          Take the test
        </button>

      </div>
    </section>
  );
}

/* STAT COMPONENT */
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
