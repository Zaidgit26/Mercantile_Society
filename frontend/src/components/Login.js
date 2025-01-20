import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Get registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => 
      u.email === loginData.email && 
      u.password === loginData.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Login successful!');
      navigate('/home');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <LoginWrapper>
      <LoginForm onSubmit={handleLogin}>
        <h2>Login</h2>
        <InputGroup>
          <Input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            required
            placeholder="Email"
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({
              ...prev,
              password: e.target.value
            }))}
            required
            placeholder="Password"
          />
        </InputGroup>
        <LoginButton type="submit">Login</LoginButton>
      </LoginForm>
    </LoginWrapper>
  );
};

export default Login; 