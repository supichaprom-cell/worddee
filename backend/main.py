# main.py (updated with sentence support)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import httpx
import random
from datetime import datetime, timedelta, date

app = FastAPI(title="Worddee API (with user scores)")

# Allow React app to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# n8n webhook
N8N_WEBHOOK = "http://localhost:5678/webhook/score-sentence"


# ---------------------------------------------------------
# Words list
# ---------------------------------------------------------
WORDS = [
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

    # INTERMEDIATE
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

    # ADVANCED
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
# USER DATABASE (memory)
# ---------------------------------------------------------
users: Dict[str, Dict[str, Any]] = {}


# ---------------------------------------------------------
# MODELS
# ---------------------------------------------------------
class ScoreIn(BaseModel):
    score: int
    word: Optional[str] = ""
    sentence: Optional[str] = ""   # ✅ เพิ่ม sentence
    date: Optional[str] = None
    level: Optional[str] = "unknown"


class ValidatePayload(BaseModel):
    sentence: str
    user: Optional[str] = "guest"
    word: Optional[str] = None


# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------
def today_str() -> str:
    return date.today().strftime("%Y-%m-%d")


def ensure_user(username: str):
    if username not in users:
        users[username] = {
            "summary": {"day_streak": 0, "level": 1, "total_xp": 0},
            "scores": []
        }


def compute_total_xp(username: str) -> int:
    return sum(int(s.get("score", 0)) for s in users[username]["scores"])


def compute_level(total_xp: int) -> int:
    return 1 + (total_xp // 100)


def compute_day_streak(username: str) -> int:
    dates = sorted({s.get("date") for s in users[username]["scores"] if s.get("date")})
    if not dates:
        return 0

    date_objs = sorted([datetime.strptime(d, "%Y-%m-%d").date() for d in dates], reverse=True)

    streak = 0
    current = date.today()

    for d in date_objs:
        if d == current:
            streak += 1
            current -= timedelta(days=1)
        elif d < current:
            break

    return streak


def update_summary(username: str):
    total = compute_total_xp(username)
    level = compute_level(total)
    streak = compute_day_streak(username)
    users[username]["summary"] = {
        "total_xp": total,
        "level": level,
        "day_streak": streak,
    }


# ---------------------------------------------------------
# POST SCORE (SAVE)
# ---------------------------------------------------------
@app.post("/user/{username}/scores")
def save_score(username: str, payload: ScoreIn):
    ensure_user(username)

    entry_date = payload.date or today_str()

    record = {
        "date": entry_date,
        "score": payload.score,
        "word": payload.word,
        "sentence": payload.sentence or "",   # ✅ เก็บ sentence ที่นี่
        "level": payload.level,
        "user": username,
    }

    users[username]["scores"].append(record)

    update_summary(username)

    return {"status": "ok", "saved": record}


# ---------------------------------------------------------
# GET SCORES
# ---------------------------------------------------------
@app.get("/user/{username}/scores")
def get_scores(username: str):
    ensure_user(username)
    return users[username]["scores"]


# ---------------------------------------------------------
# GET SUMMARY
# ---------------------------------------------------------
@app.get("/user/{username}/summary")
def get_summary(username: str):
    ensure_user(username)
    update_summary(username)
    return users[username]["summary"]


# ---------------------------------------------------------
# DEBUG
# ---------------------------------------------------------
@app.get("/api/debug-history")
def debug_history():
    return users


# ---------------------------------------------------------
# Word API
# ---------------------------------------------------------
@app.get("/api/word")
def random_word():
    return random.choice(WORDS)


# ---------------------------------------------------------
# Validate Sentence via n8n
# ---------------------------------------------------------
@app.post("/api/validate-sentence")
async def validate_sentence(payload: Dict[str, Any]):
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(N8N_WEBHOOK, json=payload)
            data = resp.json()

        return data
    except:
        return {"score": 0, "error": "n8n error"}


# ---------------------------------------------------------
# RUN
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
