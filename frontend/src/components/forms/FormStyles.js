import styled from 'styled-components';

export const FormWrapper = styled.div`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const FormTitle = styled.h2`
  color: #00483d;
  text-align: left;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 500;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;

export const FieldLabel = styled.div`
  color: #00483d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 1rem;
  color: #333;
  background: rgba(248, 249, 250, 0.5);

  &:focus {
    outline: none;
    border-color: #00483d;
    background: white;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(248, 249, 250, 0.5);
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #00483d;
    background-color: white;
  }
`;

export const OTPButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #00483d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  height: 42px;

  &:disabled {
    background: #ccc;
  }
`;

export const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #00483d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #003d34;
  }

  &:disabled {
    background: #ccc;
  }
`;

export const UploadSection = styled.div`
  text-align: center;
  margin: 2rem 0;
  
  .upload-circle {
    width: 80px;
    height: 80px;
    border: 2px dashed #00483d;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    cursor: pointer;
  }

  p {
    margin-top: 1rem;
    color: #666;
    font-size: 0.9rem;
  }
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: #00483d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
  }
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #003d34;
  }
`;

export const Label = styled(FieldLabel)`
  color: #00483d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;