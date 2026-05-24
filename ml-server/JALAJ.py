from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pickle

# Load MobileNet model
model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    pooling='avg'
)

# Feature extraction function
def extract_features(img_path):

    img = image.load_img(img_path, target_size=(224, 224))

    img_array = image.img_to_array(img)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    features = model.predict(img_array)

    return features.flatten()


# Load saved embeddings
with open("embeddings.pkl", "rb") as f:

    embeddings = pickle.load(f)


# Query image
query_image = "dataset/hoodie.jpg"

query_features = extract_features(query_image)

results = []

# Compare query with saved embeddings
for file, features in embeddings:

    similarity = cosine_similarity(
        [query_features],
        [features]
    )[0][0]

    results.append((file, similarity))


# Sort results
results = sorted(
    results,
    key=lambda x: x[1],
    reverse=True
)

# Print top matches
print("\nAll Matches:\n")

for file, score in results:

    print(file, "->", score)