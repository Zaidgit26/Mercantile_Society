// In production, this would come from environment variables
const BASE_URL = 'http://your-api-url.com';

// Demo implementation - replace with real API in production
export const sendOTP = async (mobile) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${mobile}`);
      resolve({ success: true });
    }, 1000);
  });
};

export const verifyOTP = async (mobile, otp) => {
  // Simulating API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        resolve({ success: true });
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 1000);
  });
};

export const validateAadhar = async (formData) => {
  // Simulating API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation
      const aadharRegex = /^\d{12}$/;
      const isValidAadhar = aadharRegex.test(formData.aadharNumber);
      const age = calculateAge(formData.dob);
      
      if (!isValidAadhar) {
        reject(new Error('Invalid Aadhar number'));
        return;
      }
      
      if (age < 18) {
        reject(new Error('Age must be 18 or above'));
        return;
      }
      
      if (!['TN', 'PY'].includes(formData.state)) {
        reject(new Error('State must be Tamil Nadu or Puducherry'));
        return;
      }
      
      resolve({
        success: true,
        details: {
          name: formData.name,
          dob: formData.dob,
          state: formData.state,
          aadharNumber: formData.aadharNumber
        }
      });
    }, 1000);
  });
}; 