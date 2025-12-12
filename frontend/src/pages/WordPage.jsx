import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function WordPage({ username, onResult }) {
  const [phase, setPhase] = useState("loading");

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [pos, setPos] = useState("");
  const [level, setLevel] = useState("");
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadWord();
  }, []);

  // =========================================================
  // Load random word
  // =========================================================
  const loadWord = async () => {
    setPhase("loading");
    try {
      const res = await fetch(`${API_BASE}/api/word`);
      const data = await res.json();

      setWord(data.word);
      setMeaning(data.meaning);
      setPos(data.pos);
      setLevel(data.level);

      setSentence("");
      setFeedback(null);
      setPhase("challenge");
    } catch (err) {
      alert("Error loading word.");
      setPhase("challenge");
    }
  };

  // =========================================================
  // Submit → validate → save → go to result
  // =========================================================
  const submitSentence = async () => {
    if (!sentence.trim()) {
      alert("Please write a sentence.");
      return;
    }

    setPhase("loading");

    try {
      // 1️⃣ Validate sentence with n8n
      const res = await fetch(`${API_BASE}/api/validate-sentence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, sentence }),
      });

      const data = await res.json();
      setFeedback(data);

      // 2️⃣ Save score using NEW system
      await fetch(`${API_BASE}/user/${username}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: data.score,
          word: word,
          sentence: sentence,
          level: data.level,
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      // 3️⃣ Send combined result to App.jsx for result page
      onResult({
        ...data,
        word,
        sentence,
      });

    } catch (err) {
      console.error("Submit error:", err);
      alert("Error during validation.");
      setPhase("challenge");
    }
  };

  // =========================================================
  // UI Rendering
  // =========================================================

  return (
    <section className="word-page">
      <div className="hero-bg">

        {/* Loading skeleton */}
        {phase === "loading" && <LoadingCard />}

        {/* Challenge Card */}
        {phase === "challenge" && (
          <div className="card">
            <h1 className="wod-title">Word of the Day</h1>
            <p className="wod-subtitle">Write a sentence using today's word.</p>

            <div className="wod-word-row">
              <img src="/image1.jpg" className="wod-image" alt="word" />

              <div className="wod-word-info">
                <div className="wod-word-header">
                  <span className="wod-word-text">{word}</span>
                  <span className="badge badge-level">Level {level}</span>
                </div>

                <p className="wod-word-pos">{pos}</p>

                <p className="wod-word-meaning">
                  <strong>Meaning:</strong> {meaning}
                </p>
              </div>
            </div>

            {/* Input */}
            <input
              className="wod-input"
              placeholder="Write your sentence..."
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            />

            {/* Buttons */}
            <div className="wod-actions">
              <button className="btn btn-ghost" onClick={loadWord}>
                New word
              </button>

              <button className="btn btn-primary" onClick={submitSentence}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   LOADING SKELETON COMPONENT
========================================================= */

function LoadingCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton sk-title"></div>
      <div className="skeleton sk-circle"></div>
      <div className="skeleton sk-line"></div>
      <div className="skeleton sk-line long"></div>
      <div className="skeleton sk-input"></div>
      <div className="skeleton sk-button-row"></div>
    </div>
  );
}
