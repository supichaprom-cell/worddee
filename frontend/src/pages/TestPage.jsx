import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function TestPage({ username, goDashboard }) {
  const [wordData, setWordData] = useState(null);
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // โหลดคำแบบสุ่มตอนเข้าหน้า
  useEffect(() => {
    loadWord();
  }, []);

  const loadWord = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/word`);
      setWordData(await res.json());
      setSentence("");
      setResult(null);
    } catch (err) {
      console.error("Failed to load word:", err);
    }
  };

  const submitSentence = async () => {
    if (!sentence.trim()) return alert("Please write a sentence first.");

    setLoading(true);

    try {
      // เรียก AI evaluator ผ่าน n8n webhook
      const res = await fetch(`${API_BASE}/api/validate-sentence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence,
          word: wordData.word,
          user: username,
        }),
      });

      const data = await res.json();
      setResult(data);

      // บันทึกคะแนนในระบบใหม่ (Dashboard ใช้อันนี้)
      await fetch(`${API_BASE}/user/${username}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: data.score,
          word: wordData.word,
          sentence,
          level: wordData.level,
        }),
      });
    } catch (err) {
      console.error("Submit failed:", err);
    }

    setLoading(false);
  };

  if (!wordData) {
    return (
      <div className="card">
        <div className="dash-chart-placeholder">Loading word…</div>
      </div>
    );
  }

  return (
    <section className="word-page">
      <div className="hero-bg">
        <div className="card">

          {/* TITLE */}
          <h1 className="wod-title">Word of the Day</h1>
          <p className="wod-subtitle">Write a sentence using the given word</p>

          {/* WORD INFO */}
          <div className="wod-word-row">
            <img
              src={`https://source.unsplash.com/featured/?${wordData.word}`}
              className="wod-image"
              alt="word"
            />

            <div className="wod-word-info">
              <div className="wod-word-header">
                <div className="wod-word-main">
                  <span className="wod-word-bullet">•</span>
                  <span className="wod-word-text">{wordData.word}</span>
                </div>
                <span className="badge badge-level">{wordData.level}</span>
              </div>

              <div className="wod-word-pos">{wordData.pos}</div>
              <p className="wod-word-meaning">{wordData.meaning}</p>
            </div>
          </div>

          {/* INPUT SENTENCE */}
          <textarea
            className="wod-input"
            rows="3"
            placeholder="Write a sentence using this word…"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />

          {/* ACTION BUTTONS */}
          <div className="wod-actions">
            <button className="btn btn-ghost" onClick={loadWord}>
              New word
            </button>

            <button className="btn btn-primary" onClick={submitSentence} disabled={loading}>
              {loading ? "Checking..." : "Submit"}
            </button>
          </div>

          {/* RESULT BLOCK */}
          {result && (
            <>
              <h2 className="result-title">Evaluation Result</h2>

              <div className="wod-result-badges">
                <span className="badge badge-score">Score: {result.score}</span>
                <span className="badge badge-level">Level: {result.level}</span>
              </div>

              <div className="wod-result-block">
                <span className="label">Corrected:</span>
                {result.corrected_sentence}
              </div>

              <div className="wod-suggestion">
                <div className="suggestion-label">Suggestion</div>
                <div className="suggestion-main">{result.suggestion}</div>
              </div>

              <button className="btn btn-primary dash-cta" onClick={goDashboard}>
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
