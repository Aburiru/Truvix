from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8000"], # Laravel dev server origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer once when the app starts
# ponytail: Using a specific pre-trained model for quick MVP.
# Upgrade: Fine-tune custom models or allow model selection.
model_name = "roberta-base-openai-detector"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

class TextRequest(BaseModel):
    text: str

@app.post("/detect/text")
async def detect_text(request: TextRequest):
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = model(**inputs).logits

    # Assuming binary classification where the second logit (index 1) corresponds to AI-generated.
    # This might need adjustment depending on the specific model's output labels.
    probabilities = torch.softmax(logits, dim=1)
    ai_probability = probabilities[:, 1].item() # Probability of being AI-generated

    return {"ai_probability": ai_probability}


# To run this service:
# 1. Install dependencies: pip install fastapi uvicorn transformers torch
# 2. Save this code as main.py
# 3. Run: uvicorn main:app --host 0.0.0.0 --port 5000
