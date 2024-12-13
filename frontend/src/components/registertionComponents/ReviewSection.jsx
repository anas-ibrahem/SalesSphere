/*
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
            businessRegistrationDoc: ''
          }}
*/
import { Box, Grid, Typography } from '@mui/material';

const ReviewSection = ({ formik }) => {

    const { values } = formik;

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Personal Information
                    </Typography>
                    <Typography variant="body1">
                        <strong>First Name: </strong>{values.firstName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Last Name: </strong>{values.lastName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Birthdate: </strong>{values.birthdate}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Address: </strong>{values.address}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Email: </strong>{values.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Phone: </strong>{values.phone}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Business Information
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Name: </strong>{values.businessName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Email: </strong>{values.businessEmail}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Phone: </strong>{values.businessPhone}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Country: </strong>{values.businessCountry}
                    </Typography>
                    <Typography variant="body1">
                        <strong>City: </strong>{values.businessCity}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Street: </strong>{values.businessStreet}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Website: </strong>{values.businessWebsite}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Industry: </strong>{values.businessIndustry}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Documents
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Manager's ID: </strong>{values.managerID.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Manager's Photo: </strong>{values.managerPhoto.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Logo: </strong>{values.businessLogo.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Business Registration Document: </strong>{values.businessRegistrationDoc.name}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ReviewSection;