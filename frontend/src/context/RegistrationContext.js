import React, { createContext, useContext, useReducer } from 'react';

const RegistrationContext = createContext();

const initialState = {
  step: 'basic-info',
  isOTPVerified: false,
  isAadharVerified: false,
  formData: {},
  errors: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'VERIFY_OTP':
      return { ...state, isOTPVerified: true };
    case 'VERIFY_AADHAR':
      return { ...state, isAadharVerified: true };
    default:
      return state;
  }
};

export const RegistrationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RegistrationContext.Provider value={{ state, dispatch }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext); 