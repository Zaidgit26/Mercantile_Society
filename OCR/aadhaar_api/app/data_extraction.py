import re

def extract_aadhaar_data(text: str) -> dict:
    """
    Extracts Aadhaar details from the OCR text using regular expressions.
    Fields include Name, Mobile, Address, State, DOB.
    """
    data = {}
    # Extract Name
    name_match = re.search(r"Name:\s*(.*)", text)
    data['name'] = name_match.group(1).strip() if name_match else "Unknown"
    
    # Extract Date of Birth (DOB)
    dob_match = re.search(r"(DOB|Date of Birth)[:\s]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})", text)
    data['dob'] = dob_match.group(2).strip() if dob_match else "Unknown"
    
    # Extract Mobile Number
    mobile_match = re.search(r"Mobile:\s*(\d{10})", text)
    data['mobile'] = mobile_match.group(1).strip() if mobile_match else "Unknown"
    
    # Extract Address
    address_match = re.search(r"Address:\s*(.*)", text)
    data['address'] = address_match.group(1).strip() if address_match else "Unknown"
    
    # Extract State
    state_match = re.search(r"State:\s*(.*)", text)
    data['state'] = state_match.group(1).strip() if state_match else "Unknown"
    
    # Log the extracted details
    print(f"Extracted Data: {data}")
    
    return data

# Verhoeff algorithm tables for checksum validation
d_table = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
]

p_table = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,9,8,4,2,7,0,6,3],
    [2,8,5,0,7,3,1,6,9,4],
    [3,0,7,6,1,9,4,2,5,8],
    [4,2,1,7,6,0,3,9,8,5],
    [5,9,8,4,0,1,2,7,3,6],
    [6,3,0,1,8,4,5,9,7,2],
    [7,4,2,5,9,8,6,3,0,1],
    [8,7,6,9,3,5,0,4,1,2],
    [9,1,4,2,5,7,8,6,3,0]
]

inv_table = [0,4,3,2,1,5,6,7,8,9]

def validate_aadhaar(aadhaar_number: str) -> bool:
    """
    Validates the Aadhaar number using the Verhoeff algorithm.
    The Aadhaar number must be exactly 12 digits long.
    """
    if len(aadhaar_number) != 12 or not aadhaar_number.isdigit():
        return False
    c = 0
    # Process the number from rightmost digit
    for i, digit in enumerate(reversed(aadhaar_number)):
        c = d_table[c][p_table[(i + 1) % 8][int(digit)]]
    return c == 0