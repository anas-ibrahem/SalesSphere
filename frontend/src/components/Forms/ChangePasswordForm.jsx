import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchAPI from "../../utils/fetchAPI";
import { ChangePasswordSchema } from "../../utils/validationSchemas";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => {
      const token = localStorage.getItem("token");

      fetchAPI("/auth/change-password", "POST", values, token)
        .then((data) => {
          console.log(data);
          formik.resetForm();
          if (!data.error) {
            toast.success(data.message);
            Navigate(-1);
          } else {
            toast.error(data.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Change Password
        </Typography>
        <TextField
          label="Current Password"
          type={showPassword ? "text" : "password"}
          name="currentPassword"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.currentPassword &&
            Boolean(formik.errors.currentPassword)
          }
          helperText={
            formik.touched.currentPassword && formik.errors.currentPassword
          }
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPassword ? (
                  <Visibility
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityOff
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPassword ? (
                  <Visibility
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityOff
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPassword ? (
                  <Visibility
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityOff
                    onClick={togglePassword}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Change Password
        </Button>
      </Box>
    </Container>
  );
};

export default ChangePasswordForm;
