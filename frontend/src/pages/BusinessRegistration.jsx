import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import PersonalInfo from '../components/registertionComponents/PersonalInfo';
import BusinessDetails from '../components/registertionComponents/BusinessDetails';
import UploadDocs from '../components/registertionComponents/UploadDocs';

import FullLogo from '../components/FullLogo';


// Validation schemas for different steps
const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required')
});

const BusinessInfoSchema = Yup.object().shape({
  businessName: Yup.string().required('Business Name is required'),
  businessType: Yup.string().required('Business Type is required'),
  registrationNumber: Yup.string().required('Registration Number is required')
});

const BusinessRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState({
    managerID: null,
    managerPhoto: null,
    businessLogo: null,
    businessRegistrationDoc: null
  });

  const steps = [
    'Personal Information', 
    'Business Details', 
    'Document Upload', 
    'Review & Submit'
  ];

  const handleFileUpload = (fileType, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch(step) {
      case 0:
        return (
          <PersonalInfo />
        );
      case 1:
        return (
          <BusinessDetails />
        );
      case 2:
        return (
          <UploadDocs 
            handleFileUpload={handleFileUpload} 
            selectedFiles={selectedFiles}
          />
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            {/* Implement a review section that shows all entered details */}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleSubmit = (values) => {
    // Implement submission logic
    console.log('Submission Values:', values);
    console.log('Uploaded Files:', selectedFiles);
  };

  return (
    <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
          backgroundColor: 'background.default'
        }}
      >
       
    <Container component="main" 
    maxWidth="md"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      transform: 'translateY(-50px)'
    }}>
       <FullLogo />
      <Paper elevation={isMobile ? 0 : 6} sx={{ p: 4, border: isMobile ? '1px solid rgba(0,0,0,0.12)' : 'none', maxWidth: '100%' }}>
        <Typography 
          component="h1" 
          variant="h4" 
          align="center" 
          gutterBottom
        >
          Business Registration
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            businessName: '',
            businessType: '',
            registrationNumber: ''
          }}
          validationSchema={
            activeStep === 0 
              ? PersonalInfoSchema 
              : activeStep === 1 
                ? BusinessInfoSchema 
                : null
          }
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  disabled={activeStep === 0} 
                  onClick={handleBack}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Submit for Review
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
    </Box>
  );
};

export default BusinessRegistration;