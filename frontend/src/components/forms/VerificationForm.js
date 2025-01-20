import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

// Reuse the styled components from LoginForm
const FormWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

// ... (reuse other styled components)

const VerificationForm = () => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    aadhar: ''
  });
  
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    registrationNumber: Yup.string()
      .required('Registration number is required'),
    aadhar: Yup.string()
      .matches(/^\d{12}$/, 'Invalid Aadhar number')
      .required('Aadhar number is required')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      // Get registered users
      const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const user = users.find(u => u.aadhar === formData.aadhar);

      if (user) {
        toast.success('Verification successful!');
        // Show user details or take appropriate action
      } else {
        toast.error('No matching records found');
      }
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      toast.error('Please check all fields');
    }
  };

  // ... (implement handleChange similar to LoginForm)

  return (
    <FormWrapper>
      <FormTitle>Verify Registration</FormTitle>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Registration Number</Label>
          <Input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Enter registration number"
          />
          {errors.registrationNumber && <ErrorText>{errors.registrationNumber}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Aadhar Number</Label>
          <Input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            placeholder="Enter Aadhar number"
          />
          {errors.aadhar && <ErrorText>{errors.aadhar}</ErrorText>}
        </InputGroup>

        <SubmitButton type="submit">Verify</SubmitButton>
      </Form>
    </FormWrapper>
  );
};

export default VerificationForm; 