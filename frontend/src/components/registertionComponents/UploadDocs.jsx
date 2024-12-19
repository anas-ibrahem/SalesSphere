import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  TextField,
} from '@mui/material';
import { 
    Maximize,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { Field } from 'formik';


const UploadDocs = ({ formik, handleFileUpload, selectedFiles }) => {

  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur 
  } = formik;
    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {[
            { 
              name: 'managerID', 
              label: 'Personal ID (Govt Issued)' 
            },
            { 
              name: 'managerPhoto', 
              label: 'Personal Photo (Selfie)' 
            },
            { 
              name: 'businessLogo', 
              label: 'Business Logo' 
            }
          ].map((file) => (
            <Grid item xs={12} key={file.name} >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '2px dashed ' + (errors[file.name] ? 'red' :( values[file.name] !== '' ? 'var(--primary-accent)' : 'grey')), 
                borderRadius: 2, 
                p: 2 
              }}>
                <input
                  required
                  name={file.name}
                  label={file.label}
                  // accept only png/jpg/jpeg files
                  accept="image/png, image/jpeg, image/jpg"
                  id={file.name}
                  style={{ display: 'none' }}
                  type="file"
                  onChange={(e) => handleFileUpload(formik, file.name, e.target.files[0])}
                                    
                />
                <label htmlFor={file.name}>
                  <Button 
                    variant="contained" 
                    component="span" 
                    startIcon={<UploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload
                  </Button>
                </label>
                <Typography variant="body2" sx={{wordWrap:'break-word', maxWidth:'50%'}}>
                  {selectedFiles[file.name] 
                    ? selectedFiles[file.name].name 
                    : file.label}
                    <small style={{color:'red'}}>
                    {
                       " " + (errors[file.name] && touched[file.name] ? errors[file.name] : '')
                    }
                      </small>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>);
}

export default UploadDocs;