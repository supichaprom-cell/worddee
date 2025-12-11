import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [page, setPage] = useState("word");

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      <main className="main">
        {page === "word" ? (
          <WordOfTheDayPage goDashboard={() => setPage("dashboard")} />
        ) : (
          <DashboardPage />
        )}
      </main>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */

function Navbar({ page, setPage }) {
  return (
    <header className="navbar">
      <div className="nav-logo">worddee.ai</div>
      <nav className="nav-links">
        <button
          className={`nav-link ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          My Progress
        </button>
        <button
          className={`nav-link ${page === "word" ? "active" : ""}`}
          onClick={() => setPage("word")}
        >
          Word of the Day
        </button>
      </nav>
      <div className="nav-profile" />
    </header>
  );
}

/* ---------------- WORD PAGE ---------------- */

function WordOfTheDayPage({ goDashboard }) {
  const [phase, setPhase] = useState("loading");
  const [word, setWord] = useState("");
  const [sentence, setSentence] = useState("");

  // NEW: dynamic fields from API
  const [meaning, setMeaning] = useState("");
  const [pos, setPos] = useState("");
  const [example, setExample] = useState("");

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    setPhase("loading");
    try {
      const res = await fetch(`${API_BASE}/api/word`);
      const data = await res.json();

      setWord(data.word || "");
      setMeaning(data.meaning || "");
      setPos(data.pos || "");
      setExample(data.example || "");

      setPhase("challenge");
    } catch (err) {
      console.error(err);
      alert("Error fetching word");
      setPhase("challenge");
    }
  };

  const handleSubmit = async () => {
    if (!sentence.trim()) {
      alert("Please write a sentence.");
      return;
    }

    setPhase("loading");

    try {
      const res = await fetch(`${API_BASE}/api/validate-sentence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, sentence }),
      });

      const data = await res.json();
      setFeedback(data);
      setPhase("result");
    } catch (err) {
      console.error(err);
      alert("Error validating sentence");
      setPhase("challenge");
    }
  };

  const handleClose = () => {
    setSentence("");
    setFeedback(null);
    setPhase("challenge");
  };

  return (
    <section className="word-page">
      <div className="hero-bg">
        {phase === "loading" && <LoadingCard />}

        {phase === "challenge" && (
          <div className="card">
            <h1 className="wod-title">Word of the day</h1>
            <p className="wod-subtitle">
              Practice writing a meaningful sentence using today&apos;s word.
            </p>

            <div className="wod-word-row">
              <img src="/image1.jpg" className="wod-image" alt="word visual" />

              <div className="wod-word-info">
                <div className="wod-word-header">
                  <div className="wod-word-main">
                    <span className="wod-word-bullet">▸</span>
                    <span className="wod-word-text">{word}</span>
                  </div>
                  <span className="badge badge-level">Level Beginner</span>
                </div>

                <p className="wod-word-pos">{pos}</p>

                <p className="wod-word-meaning">
                  <strong>Meaning:</strong> {meaning}
                </p>

                <p className="wod-word-example">
                  "{example}"
                </p>
              </div>
            </div>

            <input
              className="wod-input"
              placeholder="Write your sentence here..."
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            />

            <div className="wod-actions">
              <button className="btn btn-ghost" onClick={fetchWord}>
                Do it later
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}

        {phase === "result" && feedback && (
          <div className="card">
            <h1 className="result-title">Challenge completed</h1>

            <div className="wod-result-badges">
              <span className="badge badge-level">Level {feedback.level}</span>
              <span className="badge badge-score">Score {feedback.score}%</span>
            </div>

            <div className="wod-result-block">
              <span className="label">Your sentence:</span> <span>{sentence}</span>
            </div>

            <div className="wod-suggestion">
              <div className="suggestion-label">Suggestion</div>
              <div className="suggestion-main">{feedback.suggestion}</div>
              <p className="suggestion-extra">{feedback.corrected_sentence}</p>
            </div>

            <div className="wod-actions">
              <button className="btn btn-ghost" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={goDashboard}>
                View my progress
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* loading skeleton */
function LoadingCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton sk-title" />
      <div className="skeleton sk-circle" />
      <div className="skeleton sk-line" />
      <div className="skeleton sk-line long" />
      <div className="skeleton sk-input" />
      <div className="skeleton sk-button-row" />
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function DashboardPage() {
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
                <div className="dash-stat-label">hours learned</div>
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
                &lt;Create your own chart&gt;
              </div>
            ) : (
              <div className="dash-mini-chart">
                {summary.map((item) => (
                  <div key={item.date} className="mini-bar-wrapper">
                    <div
                      className="mini-bar"
                      style={{ height: `${item.score}%` }}
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
