from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io

import torch
import torch.nn as nn
from torchvision import models, transforms

app = FastAPI(title="Food101 Classification API")

# ---------------- CONFIG ----------------
IMG_SIZE = 224
NUM_CLASSES = 101
MODEL_PATH = "food101_best.pth"
LABELS_PATH = "labels.txt"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- LOAD LABELS ----------------
with open(LABELS_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# ---------------- LOAD MODEL ----------------
model = models.efficientnet_b0(weights=None)

model.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(1280, 256),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(256, NUM_CLASSES)
)

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# ---------------- TRANSFORMS ----------------
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ---------------- FASTAPI APP ----------------


@app.get("/")
def home():
    return {"message": "Food101 model is running 🚀"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Read image
    image_bytes = await image.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Preprocess
    img_tensor = transform(img).unsqueeze(0).to(device)

    # Inference
    with torch.no_grad():
        with torch.cuda.amp.autocast(enabled=device.type == "cuda"):
            outputs = model(img_tensor)
            probs = torch.softmax(outputs, dim=1)

    # Top-1
    top1_prob, top1_idx = probs.max(dim=1)

    # Top-5
    top5_prob, top5_idx = probs.topk(5, dim=1)

    result = {
        "top1": {
            "class": class_names[top1_idx.item()],
            "confidence": round(top1_prob.item(), 4)
        },
        "top5": [
            {
                "class": class_names[top5_idx[0][i].item()],
                "confidence": round(top5_prob[0][i].item(), 4)
            }
            for i in range(5)
        ]
    }

    return result
