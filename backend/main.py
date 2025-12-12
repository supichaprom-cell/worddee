# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import random
from typing import Dict, Any, List

app = FastAPI(title="Worddee API")

# Allow React app to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

# n8n webhook (adjust if your n8n runs on different host/port)
N8N_WEBHOOK = "http://localhost:5678/webhook/score-sentence"

# ---------------------------------------------------------
# Vocabulary (60 words: Beginner 20 | Intermediate 20 | Advanced 20)
# ---------------------------------------------------------
WORDS = [
    # BEGINNER (20)
    {"word": "apple", "meaning": "a round fruit", "pos": "noun", "level": "beginner"},
    {"word": "run", "meaning": "move quickly", "pos": "verb", "level": "beginner"},
    {"word": "happy", "meaning": "feeling pleasure", "pos": "adjective", "level": "beginner"},
    {"word": "book", "meaning": "written pages", "pos": "noun", "level": "beginner"},
    {"word": "water", "meaning": "clear liquid", "pos": "noun", "level": "beginner"},
    {"word": "chair", "meaning": "a seat", "pos": "noun", "level": "beginner"},
    {"word": "blue", "meaning": "color of sky", "pos": "adjective", "level": "beginner"},
    {"word": "sleep", "meaning": "to rest", "pos": "verb", "level": "beginner"},
    {"word": "dog", "meaning": "pet animal", "pos": "noun", "level": "beginner"},
    {"word": "music", "meaning": "sound art", "pos": "noun", "level": "beginner"},
    {"word": "food", "meaning": "something you eat", "pos": "noun", "level": "beginner"},
    {"word": "car", "meaning": "road vehicle", "pos": "noun", "level": "beginner"},
    {"word": "red", "meaning": "a warm color", "pos": "adjective", "level": "beginner"},
    {"word": "small", "meaning": "not large", "pos": "adjective", "level": "beginner"},
    {"word": "cat", "meaning": "a small pet", "pos": "noun", "level": "beginner"},
    {"word": "walk", "meaning": "move on foot", "pos": "verb", "level": "beginner"},
    {"word": "school", "meaning": "place to study", "pos": "noun", "level": "beginner"},
    {"word": "family", "meaning": "related people", "pos": "noun", "level": "beginner"},
    {"word": "drink", "meaning": "swallow liquid", "pos": "verb", "level": "beginner"},
    {"word": "sun", "meaning": "star of the solar system", "pos": "noun", "level": "beginner"},

    # INTERMEDIATE (20)
    {"word": "runway", "meaning": "path for airplanes", "pos": "noun", "level": "intermediate"},
    {"word": "future", "meaning": "time ahead", "pos": "noun", "level": "intermediate"},
    {"word": "teacher", "meaning": "person who educates", "pos": "noun", "level": "intermediate"},
    {"word": "airport", "meaning": "place for planes", "pos": "noun", "level": "intermediate"},
    {"word": "decision", "meaning": "choice after thinking", "pos": "noun", "level": "intermediate"},
    {"word": "community", "meaning": "people in same area", "pos": "noun", "level": "intermediate"},
    {"word": "method", "meaning": "way to do something", "pos": "noun", "level": "intermediate"},
    {"word": "natural", "meaning": "not artificial", "pos": "adjective", "level": "intermediate"},
    {"word": "purpose", "meaning": "reason for something", "pos": "noun", "level": "intermediate"},
    {"word": "improve", "meaning": "get better", "pos": "verb", "level": "intermediate"},
    {"word": "project", "meaning": "planned work", "pos": "noun", "level": "intermediate"},
    {"word": "challenge", "meaning": "a difficult task", "pos": "noun", "level": "intermediate"},
    {"word": "experience", "meaning": "practical contact", "pos": "noun", "level": "intermediate"},
    {"word": "balance", "meaning": "state of stability", "pos": "noun", "level": "intermediate"},
    {"word": "increase", "meaning": "become larger", "pos": "verb", "level": "intermediate"},
    {"word": "prepare", "meaning": "make ready", "pos": "verb", "level": "intermediate"},
    {"word": "support", "meaning": "help or assist", "pos": "noun", "level": "intermediate"},
    {"word": "valuable", "meaning": "worth a lot", "pos": "adjective", "level": "intermediate"},
    {"word": "protect", "meaning": "keep safe", "pos": "verb", "level": "intermediate"},
    {"word": "memory", "meaning": "ability to remember", "pos": "noun", "level": "intermediate"},

    # ADVANCED (20)
    {"word": "sustainable", "meaning": "can be maintained long-term", "pos": "adjective", "level": "advanced"},
    {"word": "innovation", "meaning": "new creative idea", "pos": "noun", "level": "advanced"},
    {"word": "analysis", "meaning": "detailed study", "pos": "noun", "level": "advanced"},
    {"word": "consequence", "meaning": "result of action", "pos": "noun", "level": "advanced"},
    {"word": "efficiency", "meaning": "avoid waste", "pos": "noun", "level": "advanced"},
    {"word": "complexity", "meaning": "being complicated", "pos": "noun", "level": "advanced"},
    {"word": "fundamental", "meaning": "basic and essential", "pos": "adjective", "level": "advanced"},
    {"word": "hypothesis", "meaning": "testable idea", "pos": "noun", "level": "advanced"},
    {"word": "perspective", "meaning": "point of view", "pos": "noun", "level": "advanced"},
    {"word": "significant", "meaning": "important and meaningful", "pos": "adjective", "level": "advanced"},
    {"word": "theory", "meaning": "idea explaining something", "pos": "noun", "level": "advanced"},
    {"word": "prioritize", "meaning": "rank by importance", "pos": "verb", "level": "advanced"},
    {"word": "interpret", "meaning": "explain meaning", "pos": "verb", "level": "advanced"},
    {"word": "compromise", "meaning": "mutual agreement", "pos": "noun", "level": "advanced"},
    {"word": "adaptation", "meaning": "change to suit conditions", "pos": "noun", "level": "advanced"},
    {"word": "emphasis", "meaning": "special importance", "pos": "noun", "level": "advanced"},
    {"word": "regulation", "meaning": "official rule", "pos": "noun", "level": "advanced"},
    {"word": "transformation", "meaning": "major change", "pos": "noun", "level": "advanced"},
    {"word": "assessment", "meaning": "evaluation", "pos": "noun", "level": "advanced"},
    {"word": "correlation", "meaning": "connection between things", "pos": "noun", "level": "advanced"},
]

# ---------------------------------------------------------
# Simple in-memory history
# ---------------------------------------------------------
# Note: in-memory history resets when process restarts.
# For production, use persistent storage (database).
history: List[Dict[str, Any]] = []


# ---------------------------------------------------------
# API: Random word
# ---------------------------------------------------------
@app.get("/api/word")
def get_random_word():
    item = random.choice(WORDS)
    return {
        "word": item["word"],
        "meaning": item["meaning"],
        "pos": item["pos"],
        "level": item["level"],
    }


# ---------------------------------------------------------
# API: Validate sentence (via n8n webhook)
# ---------------------------------------------------------
@app.post("/api/validate-sentence")
async def validate_sentence(payload: Dict[str, Any]):
    """
    Forward payload to n8n webhook which should return a JSON like:
    { "score": 85, "level": "beginner", "suggestion": "...", "corrected_sentence": "..." }
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(N8N_WEBHOOK, json=payload)
            # If n8n returns non-JSON or error, this will raise an exception
            data = resp.json()

        return {
            "score": data.get("score", 0),
            "level": data.get("level", "Unknown"),
            "suggestion": data.get("suggestion", "No suggestion."),
            "corrected_sentence": data.get("corrected_sentence", payload.get("sentence", "")),
        }
    except Exception as e:
        # Fallback response if webhook fails
        return {
            "score": 0,
            "level": "Error",
            "suggestion": "Server error contacting AI evaluator.",
            "corrected_sentence": payload.get("sentence", ""),
            "debug": str(e),
        }


# ---------------------------------------------------------
# API: Save history
# ---------------------------------------------------------
@app.post("/api/save-history")
def save_history(entry: Dict[str, Any]):
    """
    Save an entry to in-memory history.
    We normalize and ensure required fields exist so frontend can always rely on keys.
    Expected fields (frontend should send): date, score, word, level, user
    """
    fixed = {
        "date": entry.get("date", "unknown"),
        "score": int(entry.get("score", 0) or 0),
        "word": entry.get("word", "") or "",
        "level": entry.get("level", "unknown") or "unknown",
        "user": (entry.get("user") or "guest"),
    }
    history.append(fixed)
    return {"status": "ok", "saved": fixed}


# ---------------------------------------------------------
# API: Summary (list history)
# ---------------------------------------------------------
@app.get("/api/summary")
def summary():
    return history


# ---------------------------------------------------------
# API: Debug helper
# ---------------------------------------------------------
@app.get("/api/debug-history")
def debug_history():
    return {"count": len(history), "history": history}


# ---------------------------------------------------------
# Run with: uvicorn main:app --reload
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
