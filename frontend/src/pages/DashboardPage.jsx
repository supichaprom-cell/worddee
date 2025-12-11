import { useEffect, useState } from "react";
const API_BASE = "http://worddee-backend:8000";

export default function DashboardPage() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/summary`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="dashboard-section">
      <div className="dashboard-card">
        <h1 className="dash-title">Learner dashboard</h1>

        <h2 className="dash-subheading">Your missions today</h2>
        <div className="dash-banner">
          Well done! You&apos;ve completed all your missions.
        </div>

        <h2 className="dash-subheading">Overview</h2>
        <div className="dash-overview">
          <div className="dash-overview-header">Learning consistency</div>
          <div className="dash-overview-stats">
            <div className="dash-stat">
              <div className="dash-stat-icon">🔥</div>
              <div>
                <div className="dash-stat-value">1</div>
                <div className="dash-stat-label">Day streak</div>
              </div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon">⏱</div>
              <div>
                <div className="dash-stat-value">10</div>
                <div className="dash-stat-label">
                  [Hours / Minutes] learned
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <span>Latest band scores</span>
            <a href="#" className="dash-link">
              View scoring criteria
            </a>
          </div>

          <div className="dash-chart-body">
            {loading ? (
              <div className="dash-chart-placeholder">Loading progress…</div>
            ) : summary.length === 0 ? (
              <div className="dash-chart-placeholder">
                &lt;Create your own data visualization&gt;
              </div>
            ) : (
              <div className="dash-mini-chart">
                {summary.map((item) => (
                  <div key={item.date} className="mini-bar-wrapper">
                    <div
                      className="mini-bar"
                      style={{ height: `${item.score}%` }}
                      title={`${item.date}: ${item.score}`}
                    />

                    <span className="mini-bar-label">
                      {item.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="btn btn-primary dash-cta">Take the test</button>
      </div>
    </section>
  );
}
