export default function ResultPage({ data, goDashboard, goRetry }) {
  if (!data) {
    return (
      <section className="word-page">
        <div className="hero-bg">
          <div className="card">
            <h1 className="result-title">No result available</h1>
            <button className="btn btn-primary" onClick={goRetry}>
              Back to test
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="word-page">
      <div className="hero-bg">

        <div className="card">

          <h1 className="result-title">Challenge Completed</h1>

          {/* BADGES */}
          <div className="wod-result-badges">
            <span className="badge badge-level">Level {data.level}</span>
            <span className="badge badge-score">Score {data.score}%</span>
          </div>

          {/* USER SENTENCE */}
          <div className="wod-result-block">
            <span className="label">Your sentence:</span> {data.sentence}
          </div>

          {/* AI FEEDBACK */}
          <div className="wod-suggestion">
            <div className="suggestion-label">Suggestion</div>
            
            {/* SHOW ONLY SUGGESTION */}
            <div className="suggestion-main">{data.suggestion}</div>
            
            {/* REMOVED corrected_sentence */}
            {/* <p className="suggestion-extra">{data.corrected_sentence}</p> */}
          </div>

          {/* BUTTONS */}
          <div className="wod-actions">
            <button className="btn btn-ghost" onClick={goRetry}>
              Try again
            </button>

            <button className="btn btn-primary" onClick={goDashboard}>
              View my progress
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
