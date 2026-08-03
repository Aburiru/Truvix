from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
# from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights # Example import
# from some_detection_library import load_model, predict_image_ai_probability # Placeholder for actual model

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"], # Laravel dev server origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder for image detection model and weights
# ponytail: Placeholder model. Replace with actual pre-trained deepfake model.
# The explore task should provide a better model.
class DummyImageModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = torch.nn.Conv2d(3, 10, kernel_size=3, padding=1)
        self.pool = torch.nn.AdaptiveAvgPool2d((1, 1))
        self.fc = torch.nn.Linear(10, 1)
        self.sigmoid = torch.nn.Sigmoid()

    def forward(self, x):
        x = self.conv(x)
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return self.sigmoid(x)

# Load the model once
try:
    # Example: model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
    # model.eval() # Set to evaluation mode
    # For dummy model:
    image_model = DummyImageModel()
    image_model.eval()
except Exception as e:
    raise RuntimeError(f"Failed to load image detection model: {e}")

# Image preprocessing transform
preprocess = transforms.Compose([
    transforms.Resize((224, 224)), # Common input size for many CNNs
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]), # ImageNet standards
])

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        input_tensor = preprocess(image)
        input_batch = input_tensor.unsqueeze(0) # Add batch dimension

        with torch.no_grad():
            output = image_model(input_batch)
        
        ai_probability = output.item()

        return {"ai_probability": ai_probability}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")

@app.get("/health")
def health():
    # Check if model is loaded
    model_loaded = image_model is not None
    return {"status": "ok", "model_loaded": model_loaded}

# To run this service:
# 1. Install dependencies: pip install fastapi uvicorn Pillow torch torchvision
# 2. Save this code as main.py
# 3. Run: uvicorn main:app --host 0.0.0.0 --port 5001
