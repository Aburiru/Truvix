from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoImageProcessor, AutoModelForImageClassification

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
# Load models
# Text model
text_model_name = "cardiffnlp/twitter-roberta-base-sentiment"
text_tokenizer = AutoTokenizer.from_pretrained(text_model_name)
text_model = AutoModelForSequenceClassification.from_pretrained(text_model_name)

# Image model – ViT‑B/16 fine‑tuned for AI‑image detection
image_model_name = "umm-maybe/AI-image-detector"
image_processor = AutoImageProcessor.from_pretrained(image_model_name)
image_model = AutoModelForImageClassification.from_pretrained(image_model_name)
# Move to CUDA if available and use half precision to fit VRAM
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
image_model.to(device)
image_model.eval()
image_model = image_model.half()

class TextRequest(BaseModel):
    text: str

# --- Endpoints ---
@app.post("/detect/text")
async def detect_text(request: TextRequest):
    inputs = text_tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = text_model(**inputs).logits
    ai_prob = torch.softmax(logits, dim=1)[:, 0].item()
    return {"ai_probability": ai_prob, "confidence": "high" if ai_prob > 0.8 else "low", "prediction": "AI" if ai_prob > 0.5 else "Human"}

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    # Read uploaded image bytes
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")

    # Preprocess image for the model
    inputs = image_processor(images=img, return_tensors="pt")
    # Ensure inputs are on the correct device and precision
    for k, v in inputs.items():
        inputs[k] = v.to(device)
        if image_model.dtype == torch.float16: # Check if model is in half precision
            inputs[k] = inputs[k].half()
    # Model is in FP16, inputs will be cast automatically
    with torch.no_grad():
        logits = image_model(**inputs).logits
    probs = torch.softmax(logits, dim=-1)[0]

    # Model outputs two classes: 0 = Real, 1 = AI‑generated
    ai_prob = probs[1].item()
    confidence = "high" if ai_prob >= 0.7 else "low"
    prediction = "AI Generated" if ai_prob >= 0.5 else "Real"

    return {"ai_probability": ai_prob, "confidence": confidence, "prediction": prediction}

@app.get("/health")
def health():
    return {"status": "ok"}
