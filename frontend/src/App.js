import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import LeftPanel from './components/LeftPanel';
import RegistrationForm from './components/forms/RegistrationForm';
import LoginForm from './components/forms/LoginForm';
import { GlobalStyle } from './styles/GlobalStyles';
import { RegistrationProvider } from './context/RegistrationContext';
import Home from './components/Home';
import Profile from './components/Profile';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(0, 72, 61, 0.05) 0%,
    rgba(251, 250, 249, 0.95) 50%,
    rgba(139, 20, 20, 0.05) 100%
  );

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  margin-left: 300px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: 80px;
  }
`;

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <Container>
            <LeftPanel />
            <MainContent>
              <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainContent>
          </Container>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 