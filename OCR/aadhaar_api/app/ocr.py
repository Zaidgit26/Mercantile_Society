import pytesseract
from PIL import Image
import cv2
import numpy as np

def preprocess_image(image: Image.Image):
    """
    Preprocesses the image for better OCR performance.
    Converts the image to grayscale and applies thresholding.
    """
    # Convert the Pillow image to an OpenCV-compatible format
    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray_image = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    # Apply thresholding to binarize the image
    _, thresh = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY)
    return thresh

def perform_ocr(image: Image.Image) -> str:
    """
    Runs OCR on the input image and returns the extracted text.
    """
    preprocessed = preprocess_image(image)
    text = pytesseract.image_to_string(preprocessed)
    return text