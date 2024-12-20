import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const UploadDocs = ({ formik, handleFileUpload, selectedFiles }) => {
  const { 
    values, 
    errors, 
    touched,
    setFieldValue,
    setFieldTouched
  } = formik;

  const [uploading, setUploading] = useState({
    managerID: false,
    managerPhoto: false,
    businessLogo: false
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    url: ''
  });

  // Update Formik values when selectedFiles change
  useEffect(() => {
    Object.entries(selectedFiles).forEach(([fieldName, url]) => {
      if (url && values[fieldName] !== url) {
        setFieldValue(fieldName, url);
        setFieldTouched(fieldName, true, false);
      }
    });
  }, [selectedFiles, setFieldValue, setFieldTouched, values]);

  const handleFileChange = async (fileType, file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG or PNG.');
      setFieldTouched(fileType, true);
      return;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      setFieldTouched(fileType, true);
      return;
    }

    setUploading(prev => ({ ...prev, [fileType]: true }));
    setFieldTouched(fileType, true);
    
    try {
      await handleFileUpload(formik, fileType, file);
    } catch (error) {
      setFieldValue(fileType, '');
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [fileType]: false }));
    }
  };

  const handlePreview = (url) => {
    if (url) {
      setPreviewDialog({ open: true, url });
    }
  };

  // Required fields validation helper
  const isFieldRequired = (fieldName) => {
    return !values[fieldName] && touched[fieldName];
  };

  return (
    <Box sx={{ mt: 3 }}>
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
          <Grid item xs={12} key={file.name}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '2px dashed ' + (isFieldRequired(file.name) ? 'red' : (values[file.name] ? 'var(--primary-accent)' : 'grey')), 
              borderRadius: 2, 
              p: 2 
            }}>
              <input
                required
                name={file.name}
                accept="image/png, image/jpeg, image/jpg"
                id={file.name}
                style={{ display: 'none' }}
                type="file"
                onChange={(e) => handleFileChange(file.name, e.target.files[0])}
                disabled={uploading[file.name]}
                onBlur={() => setFieldTouched(file.name, true)}
              />
              <label htmlFor={file.name}>
                <Button 
                  variant="contained" 
                  component="span" 
                  startIcon={<UploadIcon />}
                  sx={{ mr: 2 }}
                  disabled={uploading[file.name]}
                >
                  {uploading[file.name] ? 'Uploading...' : 'Upload JPEG / PNG'}
                </Button>
              </label>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
                {selectedFiles[file.name] && (
                  <Box 
                    component="img"
                    src={selectedFiles[file.name]}
                    alt={file.label}
                    sx={{ 
                      height: 40, 
                      width: 40, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-word' }}>
                  {values[file.name] ? file.label + ' uploaded' : file.label}
                  {isFieldRequired(file.name) && (
                    <small style={{color: 'red'}}>
                      {' (Required)'}
                    </small>
                  )}
                </Typography>
                {selectedFiles[file.name] && (
                  <IconButton 
                    size="small"
                    onClick={() => handlePreview(selectedFiles[file.name])}
                  >
                    <ZoomInIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={previewDialog.open} 
        onClose={() => setPreviewDialog({ open: false, url: '' })}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setPreviewDialog({ open: false, url: '' })}
            sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'background.paper' }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={previewDialog.url}
            alt="Preview"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UploadDocs;