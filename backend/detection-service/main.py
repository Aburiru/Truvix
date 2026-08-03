from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoImageProcessor, AutoModelForImageClassification, pipeline, AutoModelForCausalLM
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
import numpy as np

# Download NLTK data
nltk.download('punkt')
nltk.download('punkt_tab')

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define device globally
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Models ---
# Load models
# Text model for AI detection
text_model_name = "Hello-SimpleAI/chatgpt-detector-roberta"
text_tokenizer = AutoTokenizer.from_pretrained(text_model_name)
text_model = AutoModelForSequenceClassification.from_pretrained(text_model_name).to(device)

# Language model for perplexity
perplexity_model_name = "gpt2"
perplexity_tokenizer = AutoTokenizer.from_pretrained(perplexity_model_name)
perplexity_model = AutoModelForCausalLM.from_pretrained(perplexity_model_name).to(device)
perplexity_model.eval()

# Image model – ViT‑B/16 fine‑tuned for AI‑image detection
image_model_name = "umm-maybe/AI-image-detector"
image_processor = AutoImageProcessor.from_pretrained(image_model_name)
image_model = AutoModelForImageClassification.from_pretrained(image_model_name)
# Move to CUDA if available and use half precision to fit VRAM
image_model.to(device)
image_model.eval()
image_model = image_model.half()

class TextRequest(BaseModel):
    text: str

# --- Helper Functions for Text Analysis Metrics ---
def calculate_perplexity(text):
    if not text.strip():
        return None
    encodings = perplexity_tokenizer(text, return_tensors='pt', truncation=True, max_length=perplexity_tokenizer.model_max_length).to(device)
    seq_len = encodings.input_ids.size(1)
    if seq_len < 2: # Perplexity requires at least two tokens
        return None

    with torch.no_grad():
        nlls = []
        for i in range(0, seq_len - 1, 512):
            begin_loc = max(0, i - 512)
            end_loc = min(i + 512, seq_len)
            trg_len = end_loc - begin_loc  # may be different from 512 if end_loc is near end of sentence
            input_ids = encodings.input_ids[:, begin_loc:end_loc].to(device)
            target_ids = input_ids.clone()
            target_ids[:, :-1] = input_ids[:, 1:]
            target_ids[:, -1] = -100 # Mask the last token to avoid double counting

            outputs = perplexity_model(input_ids, labels=target_ids)
            neg_log_likelihood = outputs[0] * trg_len

            nlls.append(neg_log_likelihood)

        return torch.exp(torch.stack(nlls).sum() / (seq_len - 1)).item()

def calculate_burstiness(sentence_lengths):
    if len(sentence_lengths) < 2:
        return None
    return np.std(sentence_lengths) / np.mean(sentence_lengths) # Coefficient of variation

# --- Endpoints ---
@app.post("/detect/text")
async def detect_text(request: TextRequest):
    # AI detection probability
    inputs = text_tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512).to(device)
    with torch.no_grad():
        logits = text_model(**inputs).logits
    # Model outputs: 0 = Human, 1 = AI
    ai_prob = torch.softmax(logits, dim=1)[:, 1].item()

    # Perplexity, Burstiness, Sentence Length
    sentences = sent_tokenize(request.text)
    sentence_lengths = [len(word_tokenize(s)) for s in sentences if word_tokenize(s)]

    total_words = sum(sentence_lengths)
    sentence_count = len(sentences)
    average_sentence_length = (total_words / sentence_count) if sentence_count > 0 else 0

    perplexity_score = calculate_perplexity(request.text)
    burstiness_score = calculate_burstiness(sentence_lengths)

    return {
        "ai_probability": ai_prob,
        "confidence": "high" if ai_prob >= 0.7 else "low",
        "prediction": "AI Generated" if ai_prob >= 0.5 else "Human",
        "perplexity_score": perplexity_score,
        "burstiness_score": burstiness_score,
        "sentence_count": sentence_count,
        "average_sentence_length": average_sentence_length,
    }

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