import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
        mobile: formData.mobile
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) {
      toast.error('File size should not exceed 3MB');
      e.target.value = '';
      return;
    }
    setFormData(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            if (key === 'document' && formData[key]) {
                formDataToSend.append('document', formData[key]);
                console.log('Appending document:', formData[key].name);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        console.log('Sending registration data...');
        console.log('Form values:', {
            ...formData,
            document: formData.document ? formData.document.name : null
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

  return (
    <FormWrapper>
      <FormTitle>Registration</FormTitle>
      <FormGrid onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Label htmlFor="name" $hasValue={formData.name.length > 0}>
            Name*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Label htmlFor="email" $hasValue={formData.email.length > 0}>
            Email Address*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onFocus={(e) => e.target.showPicker()}
          />
          <Label htmlFor="dateOfBirth" $hasValue={formData.dateOfBirth.length > 0}>
            Date of Birth*
          </Label>
        </InputGroup>

        <InputGroup>
          <Select
            name="stateOfResidence"
            id="stateOfResidence"
            value={formData.stateOfResidence}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Puducherry">Puducherry</option>
          </Select>
          <Label htmlFor="stateOfResidence" $hasValue={formData.stateOfResidence.length > 0}>
            State of Residence*
          </Label>
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
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength="10"
            />
            <Label htmlFor="mobile" $hasValue={formData.mobile.length > 0}>
              Mobile Number*
            </Label>
          </InputGroup>
          <OTPButton 
            onClick={handleSendOTP}
            disabled={formData.mobile.length !== 10 || countdown > 0}
          >
            {countdown > 0 ? `${countdown}s` : (isOtpSent ? 'Resend' : 'Send OTP')}
          </OTPButton>
        </div>

        <InputGroup>
          <Input
            type="text"
            name="otp"
            id="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            disabled={!isOtpSent}
          />
          <Label htmlFor="otp" $hasValue={formData.otp.length > 0}>
            OTP*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="nomineeName"
            id="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            placeholder="Enter nominee name"
          />
          <Label htmlFor="nomineeName" $hasValue={formData.nomineeName.length > 0}>
            Nominee Name*
          </Label>
        </InputGroup>

        <InputGroup>
          <Select
            name="nomineeRelationship"
            id="nomineeRelationship"
            value={formData.nomineeRelationship}
            onChange={handleChange}
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
          </Select>
          <Label htmlFor="nomineeRelationship" $hasValue={formData.nomineeRelationship.length > 0}>
            Nominee Relationship*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="aadharNumber"
            id="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            placeholder="Enter your Aadhaar number"
            maxLength="12"
          />
          <Label htmlFor="aadharNumber" $hasValue={formData.aadharNumber.length > 0}>
            Aadhaar Number*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="nomineeAadharNumber"
            id="nomineeAadharNumber"
            value={formData.nomineeAadharNumber}
            onChange={handleChange}
            placeholder="Enter nominee Aadhaar number"
            maxLength="12"
          />
          <Label htmlFor="nomineeAadharNumber" $hasValue={formData.nomineeAadharNumber.length > 0}>
            Nominee Aadhaar Number*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            as="textarea"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            style={{ minHeight: '100px', resize: 'none' }}
          />
          <Label htmlFor="address" $hasValue={formData.address.length > 0}>
            Address*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
          <Label htmlFor="city" $hasValue={formData.city.length > 0}>
            City*
          </Label>
        </InputGroup>

        <InputGroup>
          <Select
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Puducherry">Puducherry</option>
          </Select>
          <Label htmlFor="state" $hasValue={formData.state.length > 0}>
            State*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            name="pincode"
            id="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            maxLength="6"
          />
          <Label htmlFor="pincode" $hasValue={formData.pincode.length > 0}>
            Pincode*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          <Label htmlFor="password" $hasValue={formData.password.length > 0}>
            Password*
          </Label>
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />
          <Label htmlFor="confirmPassword" $hasValue={formData.confirmPassword.length > 0}>
            Confirm Password*
          </Label>
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