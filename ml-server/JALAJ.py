from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input
)

from tensorflow.keras.preprocessing import image

from sklearn.metrics.pairwise import cosine_similarity

from PIL import Image

from io import BytesIO

import requests

import numpy as np

import pickle


# Load MobileNet model
model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    pooling='avg'
)


# Feature extraction function
def extract_features(img_url):

    response = requests.get(img_url)

    img = Image.open(BytesIO(response.content))

    img = img.resize((224, 224))

    img_array = image.img_to_array(img)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    features = model.predict(img_array)

    return features.flatten()
