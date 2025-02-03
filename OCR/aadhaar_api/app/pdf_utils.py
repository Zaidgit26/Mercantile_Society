import PyPDF2
from pdf2image import convert_from_path
import tempfile

def decrypt_pdf(pdf_path: str, password: str) -> str:
    """
    Decrypts a password-protected PDF file using the provided password.
    Returns the path to the decrypted PDF file.
    """
    decrypted_pdf_path = tempfile.mktemp(suffix=".pdf")
    with open(pdf_path, "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        if pdf_reader.is_encrypted:
            try:
                pdf_reader.decrypt(password)
            except Exception as e:
                raise Exception("Invalid password provided for the PDF")
        pdf_writer = PyPDF2.PdfWriter()
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        with open(decrypted_pdf_path, "wb") as f_out:
            pdf_writer.write(f_out)
    return decrypted_pdf_path

def convert_pdf_to_images(pdf_path: str):
    """
    Converts the given PDF file into a list of images using pdf2image.
    Each page of the PDF is converted to an image.
    """
    try:
        images = convert_from_path(pdf_path, poppler_path=r"C:\Program Files\poppler-24.08.0\Library\bin")
        return images
    except Exception as e:
        raise Exception("PDF conversion failed: " + str(e))