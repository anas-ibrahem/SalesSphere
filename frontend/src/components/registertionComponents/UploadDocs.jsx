import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
} from '@mui/material';
import { 
    Maximize,
  CloudUpload as UploadIcon
} from '@mui/icons-material';


const UploadDocs = ({ handleFileUpload, selectedFiles }) => {
    return (<Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {[
            { 
              name: 'managerID', 
              label: 'Manager ID (Govt Issued)' 
            },
            { 
              name: 'managerPhoto', 
              label: 'Manager Photo' 
            },
            { 
              name: 'businessLogo', 
              label: 'Business Logo' 
            },
            { 
              name: 'businessRegistrationDoc', 
              label: 'Business Registration Document' 
            }
          ].map((file) => (
            <Grid item xs={12} key={file.name} >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '2px dashed grey', 
                borderRadius: 2, 
                p: 2 
              }}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id={file.name}
                  type="file"
                  onChange={(e) => handleFileUpload(file.name, e.target.files[0])}
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
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>);
}

export default UploadDocs;