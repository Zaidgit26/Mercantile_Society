import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const API_BASE_URL = 'http://localhost:5000/api';

const FormWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 2.5rem;
  background: linear-gradient(
    135deg,
    rgba(0, 72, 61, 0.1) 0%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(139, 20, 20, 0.1) 100%
  );
  border-radius: 25px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 72, 61, 0.1),
    0 4px 8px rgba(139, 20, 20, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormTitle = styled.h2`
  color: #00483d;
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 500;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  position: absolute;
  left: 12px;
  color: #00483d;
  font-size: 0.9rem;
  pointer-events: none;
  transform-origin: left top;
  transition: all 0.2s ease-out;
  background: transparent;
  padding: 0 4px;
  opacity: ${props => props.$hasValue ? '0.8' : '0.6'};
  z-index: 1;

  top: 50%;
  transform: translateY(-50%);

  ${props => props.$hasValue && `
    top: 0;
    transform: translateY(-50%) scale(0.85);
    background: white;
  `}
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 1rem;
  padding-top: 1.25rem;
  border: 1px solid rgba(0, 72, 61, 0.2);
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  color: ${props => props.value ? '#333' : 'transparent'};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00483d;
    box-shadow: 0 2px 8px rgba(0, 72, 61, 0.1);
    color: #333;
  }

  &:focus ~ ${Label} {
    top: 0;
    transform: translateY(-50%) scale(0.85);
    opacity: 1;
    color: #00483d;
    background: white;
  }

  &::placeholder {
    color: transparent;
  }

  &[type="date"] {
    color: ${props => props.value ? '#333' : 'transparent'};
    padding-top: 1rem;
    
    &:focus {
      color: #333;
    }
    
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: ${props => props.value ? '1' : '0'};
    }
  }
`;

const Select = styled.select`
  width: 100%;
  height: 56px;
  padding: 1rem;
  padding-top: 1.25rem;
  border: 1px solid rgba(0, 72, 61, 0.2);
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  color: ${props => props.value ? '#333' : 'transparent'};
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00483d;
    box-shadow: 0 2px 8px rgba(0, 72, 61, 0.1);
    color: #333;
  }

  &:focus ~ ${Label} {
    top: 0;
    transform: translateY(-50%) scale(0.85);
    opacity: 1;
    color: #00483d;
    background: white;
  }

  & option {
    color: #333;
  }

  & option:first-child {
    color: transparent;
  }

  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300483d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
`;

const OTPButton = styled.button`
  height: 56px;
  padding: 0 1.5rem;
  background: rgb(89, 147, 142);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: 0.5rem;

  &:hover {
    background: rgba(89, 147, 142, 0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UploadArea = styled.div`
  width: 120px;
  height: 120px;
  border: 2px dashed rgba(0, 72, 61, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 1.5rem auto;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00483d;
    transform: scale(1.02);
  }

  &::after {
    content: "↑";
    font-size: 2rem;
    color: #00483d;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #00483d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;

  &:hover {
    background: rgba(0, 72, 61, 0.9);
    transform: translateY(-1px);
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const PasswordStrengthIndicator = styled.div`
  height: 4px;
  background: ${props => {
    if (props.strength === 'strong') return '#28a745';
    if (props.strength === 'medium') return '#ffc107';
    return '#dc3545';
  }};
  transition: all 0.3s ease;
  margin-top: 0.5rem;
`;

// Add password strength checker
const checkPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
};

// Add validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000), 'Must be at least 18 years old'),
    
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    
  aadharNumber: Yup.string()
    .required('Aadhaar number is required')
    .matches(/^\d{12}$/, 'Invalid Aadhaar number')
    .test('valid-aadhar', 'Invalid Aadhaar number', (value) => {
      if (!value) return false;
      // Add Verhoeff algorithm check for Aadhaar
      return true; // Implement actual validation
    }),
    
  nomineeName: Yup.string()
    .required('Nominee name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    
  nomineeAadharNumber: Yup.string()
    .required('Nominee Aadhaar number is required')
    .matches(/^\d{12}$/, 'Invalid Aadhaar number'),
    
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid Indian pincode'),
    
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
    
  document: Yup.mixed()
    .required('Document is required')
    .test('fileSize', 'File size must be less than 3MB', (value) => {
      if (!value) return true;
      return value.size <= 3 * 1024 * 1024;
    })
    .test('fileType', 'Only PDF, JPG, JPEG, PNG files are allowed', (value) => {
      if (!value) return true;
      return ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type);
    })
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Define handleSubmit before using it in Formik config
  const handleSubmit = async (values) => {
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(values).forEach(key => {
        if (key === 'document' && values[key]) {
          formDataToSend.append('document', values[key]);
          console.log('Appending document:', values[key].name);
        } else {
          formDataToSend.append(key, values[key]);
        }
      });

      console.log('Sending registration data...');
      console.log('Form values:', {
        ...values,
        document: values.document ? values.document.name : null
      });

      const response = await axios.post(`${API_BASE_URL}/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        console.log('Registration successful:', response.data);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  // Now initialize Formik after handleSubmit is defined
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      dateOfBirth: '',
      stateOfResidence: '',
      mobile: '',
      otp: '',
      nomineeName: '',
      nomineeRelationship: '',
      aadharNumber: '',
      nomineeAadharNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      password: '',
      confirmPassword: '',
      document: null
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, {
        mobile: formik.values.mobile
      });
      if (response.data.success) {
        setIsOtpSent(true);
        startCountdown();
        toast.success('OTP sent successfully! Check Terminal')
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) {
      toast.error('File size should not exceed 3MB');
      e.target.value = '';
      return;
    }
    formik.setFieldValue('document', file);
  };

  return (
    <FormWrapper>
      <FormTitle>Registration</FormTitle>
      <FormGrid onSubmit={formik.handleSubmit}>
        <InputGroup>
          <Input
            type="text"
            name="name"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your name"
            isError={formik.touched.name && formik.errors.name}
          />
          <Label htmlFor="name" $hasValue={formik.values.name.length > 0}>
            Name*
          </Label>
          {formik.touched.name && formik.errors.name && (
            <ErrorText>{formik.errors.name}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="email"
            name="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            isError={formik.touched.email && formik.errors.email}
          />
          <Label htmlFor="email" $hasValue={formik.values.email.length > 0}>
            Email Address*
          </Label>
          {formik.touched.email && formik.errors.email && (
            <ErrorText>{formik.errors.email}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onFocus={(e) => e.target.showPicker()}
            isError={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
          />
          <Label htmlFor="dateOfBirth" $hasValue={formik.values.dateOfBirth.length > 0}>
            Date of Birth*
          </Label>
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <ErrorText>{formik.errors.dateOfBirth}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Select
            name="stateOfResidence"
            id="stateOfResidence"
            value={formik.values.stateOfResidence}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Puducherry">Puducherry</option>
          </Select>
          <Label htmlFor="stateOfResidence" $hasValue={formik.values.stateOfResidence.length > 0}>
            State of Residence*
          </Label>
          {formik.touched.stateOfResidence && formik.errors.stateOfResidence && (
            <ErrorText>{formik.errors.stateOfResidence}</ErrorText>
          )}
        </InputGroup>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto', 
          gap: '0.5rem', 
          alignItems: 'start'
        }}>
          <InputGroup>
            <Input
              type="tel"
              name="mobile"
              id="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter mobile number"
              maxLength="10"
              isError={formik.touched.mobile && formik.errors.mobile}
            />
            <Label htmlFor="mobile" $hasValue={formik.values.mobile.length > 0}>
              Mobile Number*
            </Label>
            {formik.touched.mobile && formik.errors.mobile && (
              <ErrorText>{formik.errors.mobile}</ErrorText>
            )}
          </InputGroup>
          <OTPButton 
            onClick={handleSendOTP}
            disabled={formik.values.mobile.length !== 10 || countdown > 0}
          >
            {countdown > 0 ? `${countdown}s` : (isOtpSent ? 'Resend' : 'Send OTP')}
          </OTPButton>
        </div>

        <InputGroup>
          <Input
            type="text"
            name="otp"
            id="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            placeholder="Enter OTP"
            disabled={!isOtpSent}
            isError={formik.touched.otp && formik.errors.otp}
          />
          <Label htmlFor="otp" $hasValue={formik.values.otp.length > 0}>
            OTP*
          </Label>
          {formik.touched.otp && formik.errors.otp && (
            <ErrorText>{formik.errors.otp}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="nomineeName"
            id="nomineeName"
            value={formik.values.nomineeName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter nominee name"
            isError={formik.touched.nomineeName && formik.errors.nomineeName}
          />
          <Label htmlFor="nomineeName" $hasValue={formik.values.nomineeName.length > 0}>
            Nominee Name*
          </Label>
          {formik.touched.nomineeName && formik.errors.nomineeName && (
            <ErrorText>{formik.errors.nomineeName}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Select
            name="nomineeRelationship"
            id="nomineeRelationship"
            value={formik.values.nomineeRelationship}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
          </Select>
          <Label htmlFor="nomineeRelationship" $hasValue={formik.values.nomineeRelationship.length > 0}>
            Nominee Relationship*
          </Label>
          {formik.touched.nomineeRelationship && formik.errors.nomineeRelationship && (
            <ErrorText>{formik.errors.nomineeRelationship}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="aadharNumber"
            id="aadharNumber"
            value={formik.values.aadharNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your Aadhaar number"
            maxLength="12"
            isError={formik.touched.aadharNumber && formik.errors.aadharNumber}
          />
          <Label htmlFor="aadharNumber" $hasValue={formik.values.aadharNumber.length > 0}>
            Aadhaar Number*
          </Label>
          {formik.touched.aadharNumber && formik.errors.aadharNumber && (
            <ErrorText>{formik.errors.aadharNumber}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="nomineeAadharNumber"
            id="nomineeAadharNumber"
            value={formik.values.nomineeAadharNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter nominee Aadhaar number"
            maxLength="12"
            isError={formik.touched.nomineeAadharNumber && formik.errors.nomineeAadharNumber}
          />
          <Label htmlFor="nomineeAadharNumber" $hasValue={formik.values.nomineeAadharNumber.length > 0}>
            Nominee Aadhaar Number*
          </Label>
          {formik.touched.nomineeAadharNumber && formik.errors.nomineeAadharNumber && (
            <ErrorText>{formik.errors.nomineeAadharNumber}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            as="textarea"
            name="address"
            id="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your address"
            style={{ minHeight: '100px', resize: 'none' }}
            isError={formik.touched.address && formik.errors.address}
          />
          <Label htmlFor="address" $hasValue={formik.values.address.length > 0}>
            Address*
          </Label>
          {formik.touched.address && formik.errors.address && (
            <ErrorText>{formik.errors.address}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="city"
            id="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter city"
            isError={formik.touched.city && formik.errors.city}
          />
          <Label htmlFor="city" $hasValue={formik.values.city.length > 0}>
            City*
          </Label>
          {formik.touched.city && formik.errors.city && (
            <ErrorText>{formik.errors.city}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Select
            name="state"
            id="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Puducherry">Puducherry</option>
          </Select>
          <Label htmlFor="state" $hasValue={formik.values.state.length > 0}>
            State*
          </Label>
          {formik.touched.state && formik.errors.state && (
            <ErrorText>{formik.errors.state}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="pincode"
            id="pincode"
            value={formik.values.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter pincode"
            maxLength="6"
            isError={formik.touched.pincode && formik.errors.pincode}
          />
          <Label htmlFor="pincode" $hasValue={formik.values.pincode.length > 0}>
            Pincode*
          </Label>
          {formik.touched.pincode && formik.errors.pincode && (
            <ErrorText>{formik.errors.pincode}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter password"
            isError={formik.touched.password && formik.errors.password}
          />
          <Label htmlFor="password" $hasValue={formik.values.password.length > 0}>
            Password*
          </Label>
          <PasswordStrengthIndicator 
            strength={checkPasswordStrength(formik.values.password)} 
          />
          {formik.touched.password && formik.errors.password && (
            <ErrorText>{formik.errors.password}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm password"
            isError={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Label htmlFor="confirmPassword" $hasValue={formik.values.confirmPassword.length > 0}>
            Confirm Password*
          </Label>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <ErrorText>{formik.errors.confirmPassword}</ErrorText>
          )}
        </InputGroup>

        <div style={{ 
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '1rem'
        }}>
          <UploadArea onClick={() => document.getElementById('document').click()}>
            <input
              type="file"
              id="document"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
          </UploadArea>
          <span style={{ color: '#666' }}>
            Upload documents (Max 3MB)
          </span>
        </div>

        <SubmitButton 
          type="submit"
          style={{ gridColumn: '1 / -1' }}
        >
          Register
        </SubmitButton>
      </FormGrid>
    </FormWrapper>
  );
};

export default RegistrationForm; 