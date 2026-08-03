from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"], # Laravel dev server origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer once when the app starts
# ponytail: Using a specific pre-trained model for quick MVP.
# Upgrade: Fine-tune custom models or allow model selection.
# model_name = "roberta-base-openai-detector"
# If roberta-base-openai-detector fails, try this one:
model_name = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

class TextRequest(BaseModel):
    text: str

@app.post("/detect/text")
async def detect_text(request: TextRequest):
    # Make sure model and tokenizer are loaded before inference
    if not model or not tokenizer:
        return {"error": "Model not loaded"}, 500

    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = model(**inputs).logits

    # For sentiment analysis model, we'll need to map output to AI probability.
    # This is a placeholder logic. A proper AI detector model is preferred.
    # For now, let's assume higher positive sentiment score means more 'human-like'
    # and adjust to get an 'AI probability' score (lower score = more AI-like)
    probabilities = torch.softmax(logits, dim=1)
    
    # This mapping is arbitrary for demonstration. Needs a real AI detector.
    # Assume label 0 is Negative (AI-like), label 1 is Neutral, label 2 is Positive (Human-like)
    # We want AI probability, so higher negative score (0) is more AI.
    ai_probability = probabilities[:, 0].item() # Example mapping for sentiment -> AI score

    return {"ai_probability": ai_probability}

@app.get("/health")
def health():
    # Check if model and tokenizer are loaded
    model_loaded = model is not None and tokenizer is not None
    return {"status": "ok", "model_loaded": model_loaded}



# To run this service:
# 1. Install dependencies: pip install fastapi uvicorn transformers torch
# 2. Save this code as main.py
# 3. Run: uvicorn main:app --host 0.0.0.0 --port 5000
