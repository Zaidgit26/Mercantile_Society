import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const ProfileContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
`;

const ProfileHeader = styled.h2`
  color: #00483d;
  margin-bottom: 2rem;
`;

const ProfileField = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  p {
    color: #333;
    font-size: 1rem;
  }
`;

const Profile = () => {
  const { user } = useAuth();

  return (
    <ProfileContainer>
      <ProfileHeader>Profile Information</ProfileHeader>
      <ProfileField>
        <label>Name</label>
        <p>{user?.name}</p>
      </ProfileField>
      <ProfileField>
        <label>Email</label>
        <p>{user?.email}</p>
      </ProfileField>
      <ProfileField>
        <label>Mobile</label>
        <p>{user?.mobile}</p>
      </ProfileField>
      {/* Add more fields as needed */}
    </ProfileContainer>
  );
};

export default Profile; 