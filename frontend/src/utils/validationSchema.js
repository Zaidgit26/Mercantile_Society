import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Must be at least 18 years old'),
  
  state: Yup.string()
    .required('State is required')
    .oneOf(['TN', 'PY'], 'Must be Tamil Nadu or Puducherry'),
  
  mobile: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  
  aadhar: Yup.string()
    .matches(/^\d{12}$/, 'Aadhar number must be 12 digits')
    .required('Aadhar number is required'),
  
  nomineeName: Yup.string()
    .required('Nominee name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  nomineeRelation: Yup.string()
    .required('Nominee relationship is required')
    .oneOf(['Father', 'Mother', 'Spouse', 'Child'], 'Invalid relationship'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
}); 