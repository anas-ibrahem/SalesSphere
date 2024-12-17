import { 
  Box, 
  TextField, 
  Grid,
  InputAdornment,
  MenuItem,
  Menu
} from '@mui/material';
import { 
  Business as BusinessIcon, 
  Email as EmailIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { Field } from 'formik';
import countryList from 'react-select-country-list'
import { useMemo } from 'react';


const BusinessDetails = ({ formik }) => {
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur 
  } = formik;

  const countries = useMemo(() => countryList().getData(), []);

    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              required
              name="businessName"
              label="Business Name"
              placeholder="Business Name"
              variant="outlined"
              value={values.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessName && Boolean(errors.businessName)}
              helperText={touched.businessName && errors.businessName}
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
              required
              name="businessEmail"
              label="Business Email Address"
              placeholder="Email Address"
              variant="outlined"
              value={values.businessEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessEmail && Boolean(errors.businessEmail)}
              helperText={touched.businessEmail && errors.businessEmail}
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
              name="businessPhone"
              label="Business Phone Number"
              placeholder="Phone Number"
              variant="outlined"
              value={values.businessPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessPhone && Boolean(errors.businessPhone)}
              helperText={touched.businessPhone && errors.businessPhone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Country */}
            <Field
              as={TextField}
              required
              fullWidth
              name="businessCountry"
              label="Country"
              variant="outlined"
              value={values.businessCountry}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessCountry && Boolean(errors.businessCountry)}
              helperText={touched.businessCountry && errors.businessCountry}
              select
              defaultValue="EG"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon color="action" />
                  </InputAdornment>
                ),
              }}

            >
              {countries.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </Grid>
          {/* City */}
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              name="businessCity"
              label="City"
              variant="outlined"
              value={values.businessCity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessCity && Boolean(errors.businessCity)}
              helperText={touched.businessCity && errors.businessCity}
            />
          </Grid>
          {/* Street */}
          <Grid item xs={12}>
            <Field
              as={TextField}
              fullWidth
              name="businessStreet"
              label="Business Address"
              variant="outlined"
              value={values.businessStreet}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessStreet && Boolean(errors.businessStreet)}
              helperText={touched.businessStreet && errors.businessStreet}
            />
          </Grid>
          {/* Website URL */}
          <Grid item xs={12} sm={6}>
            <Field
              as={TextField}
              fullWidth
              name="businessWebsite"
              label="Business Website URL"
              placeholder="Website URL"
              variant="outlined"
              value={values.businessWebsite}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessWebsite && Boolean(errors.businessWebsite)}
              helperText={touched.businessWebsite && errors.businessWebsite}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
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
              name="businessIndustry"
              label="Business Industry"
              variant="outlined"
              value={values.businessIndustry}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessIndustry && Boolean(errors.businessIndustry)}
              helperText={touched.businessIndustry && errors.businessIndustry}
              select
              defaultValue="selectbz"
            >
                <MenuItem value="selectbz" disabled>Select Business Type</MenuItem>
                <MenuItem value="retail">Retail</MenuItem>
                <MenuItem value="services">Services</MenuItem>
                <MenuItem value="real estate">Real Estate</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="software">Software</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="digital marketing">Digital Marketing</MenuItem>
                <MenuItem value="other">Other</MenuItem>
            </Field>
          </Grid>
        </Grid>
      </Box>);
}

export default BusinessDetails;