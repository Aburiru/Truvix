from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
# Placeholder: Loading both models
model_name = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
text_model = AutoModelForSequenceClassification.from_pretrained(model_name)

class TextRequest(BaseModel):
    text: str

# --- Endpoints ---
@app.post("/detect/text")
async def detect_text(request: TextRequest):
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = text_model(**inputs).logits
    ai_prob = torch.softmax(logits, dim=1)[:, 0].item()
    return {"ai_probability": ai_prob, "confidence": "high" if ai_prob > 0.8 else "low", "prediction": "AI" if ai_prob > 0.5 else "Human"}

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    # Dummy logic to match text structure
    return {"ai_probability": 0.95, "confidence": "high", "prediction": "AI Generated"}

@app.get("/health")
def health():
    return {"status": "ok"}
