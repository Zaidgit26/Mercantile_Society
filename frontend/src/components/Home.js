import React from 'react';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Home = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <HomeWrapper>
      <h1>Welcome, {user?.name}!</h1>
      <p>This is the homepage. More features coming soon...</p>
    </HomeWrapper>
  );
};

export default Home; 