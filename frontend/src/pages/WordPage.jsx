const handleSubmit = async () => {
  if (!sentence.trim()) return alert("Write a sentence.");

  const payload = { word, sentence };

  setPhase("loading");

  try {
    const res = await fetch(`${API_BASE}/api/validate-sentence`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // save history to dashboard
    await fetch(`${API_BASE}/api/save-history`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ date: new Date().toISOString(), score: data.score })
    });

    onShowResult({ ...data, sentence });

  } catch (e) {
    console.error(e);
    alert("Server error");
  }
};
