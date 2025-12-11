export default function ResultPage({ feedback, onBack, onGoDashboard }) {
  if (!feedback) return <h2>No result found.</h2>;

  return (
    <section className="word-page">
      <div className="hero-bg">
        <div className="card">
          <h1 className="result-title">Challenge completed</h1>

          <div className="wod-result-badges">
            <span className="badge badge-level">Level {feedback.level}</span>
            <span className="badge badge-score">
              Score {feedback.score || feedback.correct}
            </span>
          </div>

          <div className="wod-result-block">
            <span className="label">Your sentence:</span>{" "}
            <span>{feedback.sentence}</span>
          </div>

          <div className="wod-suggestion">
            <div className="suggestion-label">Suggestion</div>
            <div className="suggestion-main">{feedback.suggestion}</div>
            <p className="suggestion-extra">
              {feedback.corrected_sentence}
            </p>
          </div>

          <div className="wod-actions">
            <button className="btn btn-ghost" onClick={onBack}>
              Close
            </button>
            <button className="btn btn-primary" onClick={onGoDashboard}>
              View my progress
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
