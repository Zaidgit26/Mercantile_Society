import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Panel = styled.div`
  width: 300px;
  background: linear-gradient(135deg, #00483d 0%, #8b1414 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
  z-index: 100;

  @media (max-width: 768px) {
    width: 100%;
    height: 80px;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 2rem;
    position: fixed;
    bottom: auto;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
  max-width: 200px;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    width: auto;
    max-width: 150px;
    margin-bottom: 0;
  }
`;

const Logo = styled.img`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const NavButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
  margin-top: auto;
  margin-bottom: auto;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
    width: auto;
    padding: 0;
    margin: 0;
  }
`;

const NavButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  ${props => props.$active && `
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  `}

  @media (max-width: 768px) {
    width: auto;
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const LeftPanel = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = React.useState('login');

  const handleNavigation = (route) => {
    setActiveButton(route);
    navigate(`/${route === 'login' ? '' : route}`);
  };

  return (
    <Panel>
      <LogoContainer>
        <Logo 
          src="/assets/logo.png" 
          alt="MEASI Institute of Information Technology"
        />
      </LogoContainer>
      <NavButtons>
        <NavButton 
          $active={activeButton === 'login'} 
          onClick={() => handleNavigation('login')}
        >
          Login
        </NavButton>
        <NavButton 
          $active={activeButton === 'registration'} 
          onClick={() => handleNavigation('registration')}
        >
          Registration
        </NavButton>
      </NavButtons>
    </Panel>
  );
};

export default LeftPanel; 