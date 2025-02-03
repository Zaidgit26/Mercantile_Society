from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import shutil
import tempfile
import os
from aadhaar_api.app.pdf_utils import decrypt_pdf, convert_pdf_to_images
from aadhaar_api.app.ocr import perform_ocr
from aadhaar_api.app.data_extraction import extract_aadhaar_data

# Create FastAPI instance and expose it as 'app'
app = FastAPI(title="Aadhaar OCR & Verification API")

@app.get("/", summary="Root Endpoint")
def root():
    """
    Root endpoint for the Aadhaar OCR & Verification API.
    Returns a welcome message.
    """
    return {"message": "Welcome to Aadhaar OCR & Verification API!"}

@app.get("/health", summary="API Health Check")
def health_check():
    """
    Health check endpoint to confirm that the API is running.
    """
    return {"status": "API is running"}

def save_uploaded_file(uploaded_file: UploadFile) -> str:
    """Save the uploaded file to a temporary location and return its path."""
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, uploaded_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)
    return file_path

@app.post("/upload-aadhaar", summary="Upload Aadhaar PDF")
async def upload_aadhaar(file: UploadFile = File(...), password: str = Form(...)):
    try:
        # Save the uploaded PDF file
        pdf_path = save_uploaded_file(file)
        # Decrypt the PDF using the provided password
        decrypted_pdf_path = decrypt_pdf(pdf_path, password)
        # Convert decrypted PDF to images
        images = convert_pdf_to_images(decrypted_pdf_path)
        # Perform OCR on each image and collect the text
        ocr_text = ""
        for image in images:
            ocr_text += perform_ocr(image) + "\n"
        # Extract Aadhaar details from the OCR text
        data = extract_aadhaar_data(ocr_text)
        
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add additional endpoints and logic as required.