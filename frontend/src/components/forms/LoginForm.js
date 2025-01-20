import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import axios from 'axios';

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
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
  margin-top: -5%;
`;

const FormTitle = styled.h2`
  color: #00483d;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(0, 72, 61, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  color: #333;

  &:focus {
    outline: none;
    border-color: rgba(0, 72, 61, 0.5);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 8px rgba(0, 72, 61, 0.1);
  }

  &::placeholder {
    color: #666;
    opacity: 0.8;
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
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 72, 61, 0.2);

  &:hover {
    background: rgba(0, 72, 61, 0.9);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 72, 61, 0.3);
  }
`;

const API_BASE_URL = 'http://localhost:5000/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData);
      if (response.data.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <FormWrapper>
      <FormTitle>Login</FormTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <SubmitButton type="submit">Login</SubmitButton>
      </Form>
    </FormWrapper>
  );
};

export default LoginForm; 