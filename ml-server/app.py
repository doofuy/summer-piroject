from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
from io import BytesIO
import requests
import numpy as np
import pickle
import os

app = FastAPI(
    title="DressUp AI ML Recommendation Server",
    description="MobileNetV2 based feature extraction and visual similarity recommendation",
    version="1.0.0"
)

# Enable CORS so Next.js frontend/backend can communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# Ensure dataset directory exists
if not os.path.exists("dataset"):
    os.makedirs("dataset")

app.mount("/dataset", StaticFiles(directory="dataset"), name="dataset")


# Load MobileNet model
print("Loading MobileNetV2 model...")
model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    pooling='avg'
)
print("MobileNetV2 loaded successfully.")

# Path to embeddings file
EMBEDDINGS_FILE = "embeddings.pkl"

# Feature extraction function
def extract_features(img_url: str):
    try:
        response = requests.get(img_url, timeout=15)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img = img.resize((224, 224))
        
        # Convert grayscale image to RGB if necessary
        if img.mode != "RGB":
            img = img.convert("RGB")
            
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        features = model.predict(img_array)
        return features.flatten()
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to extract features from image URL: {str(e)}"
        )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "DressUp AI ML Recommendation Server is running!",
        "embeddings_loaded": os.path.exists(EMBEDDINGS_FILE)
    }

@app.post("/recommend")
def recommend_similar(img_url: str = Query(..., description="Absolute URL of the query image hosted on Cloudinary")):
    # 1. Extract features of the query image
    query_features = extract_features(img_url)
    
    # 2. Check if embeddings file exists
    if not os.path.exists(EMBEDDINGS_FILE):
        # Fallback to high-quality mock recommendations if embeddings.pkl is not yet generated
        return {
            "success": True,
            "warning": "embeddings.pkl not found on server. Returning default smart recommendations.",
            "similar_items": ["Black Jeans", "White Sneakers", "Oversized Jacket"],
            "outfit_suggestion": "Try pairing this with black jeans and white sneakers for a classic, effortless look."
        }
        
    try:
        # 3. Load saved database embeddings
        with open(EMBEDDINGS_FILE, "rb") as f:
            embeddings = pickle.load(f)
            
        results = []
        
        # 4. Compare query features with all saved embeddings
        for file, features in embeddings:
            similarity = cosine_similarity(
                [query_features],
                [features]
            )[0][0]
            # Convert float32 to standard float for JSON serialization
            results.append((file, float(similarity)))
            
        # 5. Sort by similarity score descending
        results = sorted(results, key=lambda x: x[1], reverse=True)
        
        # Take top 5 matches
        top_matches = results[:5]
        
        # Parse match filenames for user-friendly recommendation display
        match_names = []
        for file, _ in top_matches:
            base = os.path.basename(file).split('.')[0]
            clean_name = base.replace('_', ' ').replace('-', ' ').title()
            match_names.append(clean_name)
            
        suggestion_text = f"We found highly similar styling options! We recommend pairing your outfit with a stylish {match_names[0]} or some clean {match_names[1]}."
        
        return {
            "success": True,
            "similar_items": match_names,
            "outfit_suggestion": suggestion_text,
            "raw_matches": [{"file": file, "score": score} for file, score in top_matches]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing recommendations: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
