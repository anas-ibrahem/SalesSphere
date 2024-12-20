import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    InputAdornment,
    useMediaQuery,
    useTheme
  } from '@mui/material';
  import { 
    AlternateEmail as EmailIcon,
    Lock as LockIcon,
    Key as KeyIcon,
    Visibility,
    VisibilityOff
  } from '@mui/icons-material';
  import { Formik, Form, Field } from 'formik';
  import * as Yup from 'yup';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import FullLogo from '../components/FullLogo';
  import fetchAPI from '../utils/fetchAPI';
  import toast from 'react-hot-toast';
  
  // Validation schemas for different steps
  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });
  
  const ResetSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email'),
    code: Yup.string()
      .required('Verification code is required')
      .length(6, 'Code must be 6 characters'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });
  
  const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
  
    const handleSendCode = async (values, { setSubmitting }) => {
        try {
          const response = await fetchAPI('/auth/forgot-password', 'POST', { email: values.email });
          if (!response.error) {
            setEmail(values.email);
            setStep(2);
            toast.success(response.message || 'Verification code sent to your email');
          } else {
            toast.error(response.error || 'Failed to send verification code');
          }
        } catch (error) {
          toast.error('An error occurred. Please try again later.');
        }
        setSubmitting(false);
      };
  
    const handleResetPassword = async (values, { setSubmitting }) => {
      try {
        const response = await fetchAPI('/auth/reset-password', 'POST', {
            email: email,
            code: values.code,
            newPassword: values.password,
            confirmPassword: values.confirmPassword
        });
        if (!response.error) {
          toast.success(response.message || 'Password reset successfully');
          navigate('/login');
        } else {
          toast.error(response.error || 'Failed to reset password');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
      setSubmitting(false);
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
        <Container 
          component="main" 
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            mt: 5,
            transform: 'translateY(-50px)'
          }}
        >
          <FullLogo />
          <Paper 
            elevation={isMobile ? 0 : 6}
            sx={{ 
              padding: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '100%',
              maxWidth: 400,
              border: isMobile ? '1px solid rgba(0,0,0,0.12)' : 'none'
            }}
          >
            <Typography 
              component="h1" 
              variant="h5" 
              sx={{ mb: 3, textAlign: 'center' }}
            >
              Reset Password
            </Typography>
  
            {step === 1 && (
              <Formik
                initialValues={{ email: '' }}
                validationSchema={EmailSchema}
                onSubmit={handleSendCode}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form style={{ width: '100%' }} autoComplete="off">
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      label="Email Address"
                      placeholder="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, backgroundColor: 'var(--secondary-accent)' }}
                      disabled={isSubmitting}
                    >
                      Send Verification Code
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
  
            {step === 2 && (
              <Formik
                initialValues={{ 
                  email, 
                  code: '', 
                  password: '', 
                  confirmPassword: '' 
                }}
                validationSchema={ResetSchema}
                onSubmit={handleResetPassword}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form style={{ width: '100%' }} autoComplete="off">
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      disabled
                      value={email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="code"
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      name="code"
                      autoComplete="off"
                      autoFocus
                      error={touched.code && Boolean(errors.code)}
                      helperText={touched.code && errors.code}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="password"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {showPassword ? (
                              <Visibility onClick={() => setShowPassword(!showPassword)} sx={{cursor:"pointer"}} />
                            ) : (
                              <VisibilityOff onClick={() => setShowPassword(!showPassword)} sx={{cursor:"pointer"}} />
                            )}
                          </InputAdornment>
                        )
                      }}
                    />
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="confirmPassword"
                      label="Confirm New Password"
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {showPassword ? (
                              <Visibility onClick={() => setShowPassword(!showPassword)} sx={{cursor:"pointer"}} />
                            ) : (
                              <VisibilityOff onClick={() => setShowPassword(!showPassword)} sx={{cursor:"pointer"}} />
                            )}
                          </InputAdornment>
                        )
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, backgroundColor: 'var(--secondary-accent)' }}
                      disabled={isSubmitting}
                    >
                      Reset Password
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Paper>
        </Container>
      </Box>
    );
  };
  
  export default ForgotPassword;