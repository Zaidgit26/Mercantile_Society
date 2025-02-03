# Project Overview: Aadhaar OCR & Verification API

As a professional developer, I have designed an API that efficiently extracts and validates details from password-protected Aadhaar PDF documents. The core functionality involves decrypting the provided PDF, converting its pages into images, applying robust OCR techniques, and finally extracting and validating critical Aadhaar details—all while returning a well-structured JSON response.

## Functionality & Workflow

### User Interaction
1. **Input Process**: 
    - The user uploads a password-protected Aadhaar PDF.
    - A corresponding password is provided through the client interface.
2. **Backend Communication**:
    - The PDF and password are securely sent to our backend API for processing.
  
### Backend Processing
1. **PDF Decryption & Conversion**:
    - Accept a password-protected Aadhaar PDF.
    - Decrypt the PDF using the provided password.
    - Convert each PDF page into images, preparing them for OCR processing.
    
2. **OCR Processing**:
    - Preprocess the images using techniques such as:
        - Grayscale conversion
        - Thresholding & denoising
        - Rescaling & sharpening
    - Utilize either **Tesseract OCR** or **Google Cloud Vision API** for text extraction.

3. **Data Extraction & Structuring**:
    - Process the extracted text using regex and NLP techniques to identify and extract:
        - Name
        - Date of Birth (DOB)
        - Gender
        - Aadhaar Number (with validation via the Verhoeff checksum algorithm)
        - Address
    - Compute a confidence score for the extracted fields to ensure data accuracy.

4. **Response Assembly**:
    - Generate a structured JSON response for successful requests.
    - Handle error scenarios gracefully (e.g., incorrect password, poor OCR accuracy) by returning an appropriate error message.

### API Endpoints
- **POST /upload-aadhaar**  
  **Request**:  
  - `file`: Aadhaar PDF file (multipart/form-data)  
  - `password`: Password for the PDF (string)  
  
  **Success Response (JSON)**:
  ```json
  {
    "status": "success",
    "data": {
      "name": "Rahul Kumar",
      "dob": "01-01-1990",
      "gender": "Male",
      "aadhaar_number": "1234-5678-9012",
      "address": "House No. 123, XYZ Street, Delhi, India",
      "confidence_score": 95.8
    }
  }
  ```
  
  **Failure Response (Incorrect Password)**:
  ```json
  {
    "status": "error",
    "message": "Invalid password provided for the PDF"
  }
  ```
  
  **Failure Response (Poor OCR Accuracy)**:
  ```json
  {
    "status": "error",
    "message": "Text extraction failed due to poor image quality"
  }
  ```

- **GET /health**  
  **Response**:
  ```json
  {
    "status": "API is running"
  }
  ```

## Security & Compliance
- **End-to-End Encryption**: Enforced through HTTPS to secure the transmission of sensitive data.
- **Data Privacy**: Aadhaar details are processed transiently and are not permanently stored.
- **Rate Limiting**: Implemented to mitigate API abuse.
- **Input Validation**: Ensures only valid PDF formats are processed.

## Future Enhancements
- **Custom AI OCR Model**: Optimize model performance for more precise Aadhaar detail extraction.
- **Multi-Language Support**: Extend support to include languages like Hindi, Tamil, Telugu, etc.
- **Live Aadhaar Verification**: Integrate with UIDAI APIs for real-time Aadhaar verification.

## Technology Stack

- **Programming Language**: Python 3
- **Web Framework**: FastAPI — for building high-performance asynchronous APIs.
- **PDF Handling & Conversion**:
  - **PyPDF2** for PDF decryption.
  - **pdf2image** for converting PDF pages into images.
- **OCR Engines**:
  - **Tesseract OCR** (using the `pytesseract` library).
  - Optionally, **Google Cloud Vision API** for enhanced OCR capabilities.
- **Image Processing**: 
  - **OpenCV** and **Pillow** for preprocessing the images (grayscale conversion, thresholding, etc.).
- **Data Extraction & Validation**:
  - Regular expressions and NLP libraries (e.g., **spaCy**) for extracting and validating text.
  - Custom implementation of the **Verhoeff algorithm** for Aadhaar number validation.
- **Deployment & Orchestration**:
  - **Docker** for containerization.
  - CI/CD pipelines for continuous integration and deployment.
- **Security**: SSL/TLS (HTTPS) configurations for secure communication.

This project is engineered to deliver a robust, secure, and efficient Aadhaar OCR solution that adheres to the highest standards of data privacy and accuracy.