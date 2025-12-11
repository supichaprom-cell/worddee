from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import random

app = FastAPI()

# Allow React app to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚡ Webhook ของ n8n
# docker-compose ใช้ hostname service → "n8n"
N8N_WEBHOOK = "http://localhost:5678/webhook-test/score-sentence"


# simple mock words (you can later fetch from DB or API)
WORDS = [
    {
        "word": "runway",
        "meaning": "a long strip of land on which aircraft take off and land",
        "pos": "noun",
        "example": "The plane waited on the runway before taking off."
    },
    {
        "word": "future",
        "meaning": "the time that will come after the present",
        "pos": "noun",
        "example": "You should prepare for your future."
    },
    {
        "word": "teacher",
        "meaning": "a person who helps students learn",
        "pos": "noun",
        "example": "My teacher helped me improve my skills."
    },
    {
        "word": "airport",
        "meaning": "a place where planes take off and land",
        "pos": "noun",
        "example": "We waited at the airport for our flight."
    }
]


# ⭐ fetch random daily vocabulary
@app.get("/api/word")
@app.get("/api/word")
def get_random_word():
    item = random.choice(WORDS)
    return {
        "word": item["word"],
        "meaning": item["meaning"],
        "pos": item["pos"],
        "example": item["example"]
    }

# ⭐ validate sentence using n8n AI evaluator
@app.post("/api/validate-sentence")
async def validate_sentence(payload: dict):
    """
    payload = {
        "word": "...",
        "sentence": "..."
    }

    ส่งไป n8n เพื่อประเมินผล
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(N8N_WEBHOOK, json=payload)
            n8n_data = res.json()

        # normalize ให้ตรงกับ UI frontend
        return {
            "score": n8n_data.get("score", 0),
            "level": n8n_data.get("level", "Unknown"),
            "suggestion": n8n_data.get("suggestion", "No suggestion."),
            "corrected_sentence": n8n_data.get("corrected_sentence", payload.get("sentence"))
        }

    except Exception as e:
        # fallback กรณี n8n ไม่ตอบ
        return {
            "score": 0,
            "level": "Error",
            "suggestion": "Server error contacting AI evaluator.",
            "corrected_sentence": payload.get("sentence"),
            "debug": str(e)
        }


# ⭐ save user history locally
history = []

@app.post("/api/save-history")
def save_history(entry: dict):
    """
    entry example:
    {
        "word": "runway",
        "score": 82,
        "date": "2024-12-11"
    }
    """
    history.append(entry)
    return {"status": "ok"}


# ⭐ return progress history to UI dashboard
@app.get("/api/summary")
def summary():
    return history
