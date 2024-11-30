
import * as Yup from 'yup';


// Validation schemas for different steps
const PersonalInfoSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
    password: Yup.string().required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/(?=.*[0-9])/, 'Password must contain a number')
      .matches(/(?=.*[A-Z])/, 'Password must contain an uppercase letter')
      .matches(/(?=.*[a-z])/, 'Password must contain a lowercase letter')
      .matches(/(?=.*[!@#$%^&*])/, 'Password must contain a special character'),
    confirmPassword: Yup.string().required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    birthdate: Yup.date().required('Birthdate is required')
              .max(new Date(), 'Birthdate cannot be in the future')
              .test('age', 'You must be at least 18 years old', function(value) { 
                const today = new Date();
                const birthdate = new Date(value);
                const age = today.getFullYear() - birthdate.getFullYear();
                return age >= 18;
              }
            ),
    address: Yup.string().required('Address is required'),

  });
  
  const BusinessInfoSchema = Yup.object().shape({
    businessName: Yup.string().required('Business Name is required'),
    businessEmail: Yup.string().email('Invalid email').required('Business Email is required'),
    businessPhone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
    businessCountry: Yup.string().required('Country is required'),
    businessWebsite: Yup.string().url('Invalid URL'),
    businessIndustry: Yup.string().required('Industry is required'),
  });
  
  const validateFile = (file) => {
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        return 'File size must be less than 2MB';
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return 'File format not supported';
      }
    }
    return true;
  };

  const DocumentUploadSchema = Yup.object().shape({
    managerID: Yup.mixed().required('Personal ID is required').test('fileSize', 'File size must be less than 2MB', value => validateFile(value)),
    managerPhoto: Yup.mixed().required('Personal Photo is required').test('fileSize', 'File size must be less than 2MB', value => validateFile(value)),
    businessLogo: Yup.mixed().required('Business Logo is required').test('fileSize', 'File size must be less than 2MB', value => validateFile(value)),
    businessRegistrationDoc: Yup.mixed().required('Business Registration Document is required').test('fileSize', 'File size must be less than 2MB', value => validateFile(value)),
  });

export { PersonalInfoSchema, BusinessInfoSchema, DocumentUploadSchema, validateFile };