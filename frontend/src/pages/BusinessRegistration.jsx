import React, { useContext, useEffect, useState } from 'react';
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

import toast from 'react-hot-toast';

import { Formik, Form } from 'formik';
import PersonalInfo from '../components/registertionComponents/PersonalInfo';
import BusinessDetails from '../components/registertionComponents/BusinessDetails';
import UploadDocs from '../components/registertionComponents/UploadDocs';
import { PersonalInfoSchema, BusinessInfoSchema, DocumentUploadSchema, validateFile } from '../utils/validationSchemas';
import FullLogo from '../components/FullLogo';
import ReviewSection from '../components/registertionComponents/ReviewSection';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import fetchAPI from '../utils/fetchAPI';

import { EmployeeRoles } from '../utils/Enums';



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

  const { isAuthenticated, token, setToken, setIsAuthenticated, setTokenExpired } = useContext(UserContext);

  const Navigate = useNavigate();

  console.log('isAuthenticated:', isAuthenticated);

    useEffect(() => {
      if (isAuthenticated) {
        Navigate('/home'); 
      }
    }, [isAuthenticated, Navigate]);

  if (isAuthenticated) return null;

  const steps = [
    'Personal Information', 
    'Business Details', 
    'Document Upload', 
    'Review & Submit'
  ];

  const handleFileUpload = (formik, fileType, file) => {
    const vFile = validateFile(file);
        if (vFile !== true) {

          toast(vFile, { icon: '❌' });
          formik.setFieldValue(fileType, '');
          setSelectedFiles(prev => ({
            ...prev,
            [fileType]: null
          }));
          return;
        }
        setSelectedFiles(prev => ({
          ...prev,
          [fileType]: file
        }));
        formik.setFieldValue(fileType, file);


  };

  const handleNext = (e, formik) => {
    e.preventDefault();
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      else {
        formik.setTouched(errors, true);
      }
    });

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step, formik) => {
    switch(step) {
      case 0:
        return (
          <PersonalInfo formik={formik} />
        );
      case 1:
        return (
          <BusinessDetails formik={formik} />
        );
      case 2:
        return (
          <UploadDocs 
            handleFileUpload={handleFileUpload} 
            selectedFiles={selectedFiles}
            formik={formik}
          />
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <ReviewSection formik={formik} />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Implement submission logic
    console.log('Submission Values:', values);
    console.log('Uploaded Files:', selectedFiles);
    const valuesToSubmit = {
      business_data: {
        name: values.businessName,
        phone_number: values.businessPhone,
        email: values.businessEmail,
        country: values.businessCountry,
        city: values.businessCity,
        street: values.businessStreet,
        website_url: values.businessWebsite,
        industry: values.businessIndustry
      },
      employee_data: {
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthdate,
        address: values.address,
        email: values.email,
        phone_number: values.phone,
        role: EmployeeRoles.Manager,
        password: values.password
      }
    };

    fetchAPI('/business/register', 'POST', valuesToSubmit).then(data => {
      if(data && data.error) {
        toast.error(data.error);
      }
      else {
        toast.success('Registration successful! Please wait for approval.');
        Navigate('/login');
      }
      setSubmitting(false);
    }
    ).catch(err => {
      console.error(err);
      toast.error('An error occurred. Please try again later.');
      setSubmitting(false);
    });
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
          <strong>Business Registration</strong>
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
            birthdate: '',
            address: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            businessName: '',
            businessEmail: '',
            businessPhone: '',
            businessCountry: '',
            businessCity: '',
            businessStreet: '',
            businessWebsite: '',
            businessIndustry: '',
            managerID: '',
            managerPhoto: '',
            businessLogo: '',
          }}
          validationSchema={
            activeStep === 0 
              ? PersonalInfoSchema 
              : activeStep === 1 
                ? BusinessInfoSchema 
                : activeStep === 2
                  ? DocumentUploadSchema
                  : null
          }
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              {renderStepContent(activeStep, formik)}
              
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
                    disabled={formik.isSubmitting}
                  >
                    Submit for Review
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={(e) => handleNext(e, formik)}
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