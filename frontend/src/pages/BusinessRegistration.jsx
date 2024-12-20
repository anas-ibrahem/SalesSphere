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
import { PersonalInfoSchema, BusinessInfoSchema, DocumentUploadSchema } from '../utils/validationSchemas';
import FullLogo from '../components/FullLogo';
import ReviewSection from '../components/registertionComponents/ReviewSection';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import fetchAPI from '../utils/fetchAPI';
import { EmployeeRoles } from '../utils/Enums';
import getFileUrl from '../utils/getFileURL';

const BusinessRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState({
    managerID: null,
    managerPhoto: null,
    businessLogo: null,
  });

  const { isAuthenticated } = useContext(UserContext);
  const Navigate = useNavigate();

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

  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return PersonalInfoSchema;
      case 1:
        return BusinessInfoSchema;
      case 2:
        return DocumentUploadSchema;
      default:
        return null;
    }
  };

  const handleFileUpload = async (formik, fileType, file) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG or PNG.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    const url = await getFileUrl(file);
    console.log(url);

    if (url) {
      setSelectedFiles(prev => ({
        ...prev,
        [fileType]: url
      }));
      
      console.log(fileType, url);
      formik.setFieldValue(fileType, url);
      // Mark the field as touched after successful upload
      formik.setFieldTouched(fileType, true, false);
      toast.success('File uploaded successfully.');
    } else {
      toast.error('Failed to upload file.');
    }

  };

  const handleNext = async (e, formik) => {
    e.preventDefault();
    
    // Get the current step's validation schema
    const currentSchema = getValidationSchema(activeStep);
    
    if (!currentSchema) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }

    try {
      // Validate only the fields relevant to the current step
      await currentSchema.validate(formik.values, { abortEarly: false });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (validationErrors) {
      // Set touched state for fields with errors
      const touchedFields = {};
      validationErrors.inner.forEach(error => {
        touchedFields[error.path] = true;
      });
      formik.setTouched(touchedFields);
      
      // Show error message
      toast.error('Please fill in all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step, formik) => {
    switch(step) {
      case 0:
        return <PersonalInfo formik={formik} />;
      case 1:
        return <BusinessDetails formik={formik} />;
      case 2:
        return <UploadDocs handleFileUpload={handleFileUpload} selectedFiles={selectedFiles} formik={formik} />;
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
    const valuesToSubmit = {
      business_data: {
        name: values.businessName,
        phone_number: values.businessPhone,
        email: values.businessEmail,
        country: values.businessCountry,
        city: values.businessCity,
        street: values.businessStreet,
        website_url: values.businessWebsite,
        industry: values.businessIndustry,
        business_logo_url: values.businessLogo,
        managerid_card_url: values.managerID,
        manager_personal_photo_url: values.managerPhoto
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

    fetchAPI('/business/register', 'POST', valuesToSubmit)
      .then(data => {
        if (data && data.error) {
          toast.error(data.error);
        } else {
          toast.success('Registration successful! Please wait for approval.');
          Navigate('/login');
        }
        setSubmitting(false);
      })
      .catch(err => {
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
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', transform: 'translateY(-50px)' }}>
        <FullLogo />
        <Paper elevation={isMobile ? 0 : 6} sx={{ p: 4, border: isMobile ? '1px solid rgba(0,0,0,0.12)' : 'none', maxWidth: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
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
            validationSchema={getValidationSchema(activeStep)}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                {renderStepContent(activeStep, formik)}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
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