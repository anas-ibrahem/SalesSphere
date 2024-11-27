import { 
  Box, 
  TextField, 
  Grid,
  InputAdornment,
  MenuItem
} from '@mui/material';
import { 
  Business as BusinessIcon, 
} from '@mui/icons-material';
import { Field } from 'formik';

const BusinessDetails = () => {
    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              name="businessName"
              label="Business Name"
              placeholder="Business Name"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              name="businessType"
              label="Business Type"
              variant="outlined"
              select
              defaultValue="selectbz"
            >
                <MenuItem value="selectbz" disabled>Select Business Type</MenuItem>
                <MenuItem value="LLC">LLC</MenuItem>
                <MenuItem value="Corporation">Corporation</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
            </Field>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              type="number"
              fullWidth
              name="registrationNumber"
              label="Registration Number"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>);
}

export default BusinessDetails;