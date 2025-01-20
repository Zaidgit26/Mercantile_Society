import React from 'react';
import styled from 'styled-components';
import RegistrationForm from './forms/RegistrationForm';
import LoginForm from './forms/LoginForm';
import VerificationForm from './forms/VerificationForm';

const Panel = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

const RightPanel = ({ activeForm }) => {
  const renderForm = () => {
    switch (activeForm) {
      case 'registration':
        return <RegistrationForm />;
      case 'verification':
        return <VerificationForm />;
      default:
        return <LoginForm />;
    }
  };

  return <Panel>{renderForm()}</Panel>;
};

export default RightPanel; 