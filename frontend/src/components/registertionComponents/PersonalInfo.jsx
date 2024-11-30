import { 
  Box, 
  TextField, 
  Grid,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CalendarMonth,
  Home
} from '@mui/icons-material';
import { Field } from 'formik';
import { useState } from 'react';

const PersonalInfo = ({ formik }) => {

  const [showPassword, setShowPassword] = useState(false);
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur 
  } = formik;

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }
    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              required
              name="firstName"
              label="First Name"
              placeholder="First Name"
              variant="outlined"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              required
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              variant="outlined"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            { /* Birthdate */ }
            <Field
              as={TextField}
              fullWidth
              required
              name="birthdate"
              label="Birthdate"
              type="date"
              variant="outlined"
              value={values.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.birthdate && Boolean(errors.birthdate)}
              helperText={touched.birthdate && errors.birthdate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            { /* Address */ }
            <Field
              as={TextField}
              fullWidth
              required
              name="address"
              label="Address"
              placeholder="Address"
              variant="outlined"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              required
              name="email"
              label="Email Address"
              placeholder="Email Address"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              required
              name="phone"
              label="Phone Number"
              placeholder="Phone Number"
              variant="outlined"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              required
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              variant="outlined"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
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
                      <Visibility onClick={togglePassword} sx={{cursor:"pointer"}} />
                    ) : (
                      <VisibilityOff onClick={togglePassword} sx={{cursor:"pointer"}} />
                    )}
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              required
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              variant="outlined"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
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
                      <Visibility onClick={togglePassword} sx={{cursor:"pointer"}} />
                    ) : (
                      <VisibilityOff onClick={togglePassword} sx={{cursor:"pointer"}} />
                    )}
                  </InputAdornment>
                )
              }}
            />
            </Grid>
        </Grid>
      </Box>);
}

export default PersonalInfo;