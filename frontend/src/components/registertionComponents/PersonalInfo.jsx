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
} from '@mui/icons-material';
import { Field } from 'formik';

const PersonalInfo = () => {
    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              name="firstName"
              label="First Name"
              placeholder="First Name"
              variant="outlined"
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
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              name="email"
              label="Email Address"
                placeholder="Email Address"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              name="phone"
              label="Phone Number"
                placeholder="Phone Number"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>);
}

export default PersonalInfo;