import React from "react";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useHistory, Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import { Box, Link, Typography } from "components/material-ui";
import { InnerForm } from "./components";
import { setMessage } from "redux/reducers/messageReducer";

export const ResetPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      // const response = await AuthService.resetPassword(values);
      dispatch(
        setMessage({
          type: "success",
          message:
            "Just sent an confirmation to your email, Please check your email!",
        })
      );
      history.push("/auth/sign-in");
    } catch (error) {
      const message = error.message || "Something went wrong";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <Box padding={1}>
      <Helmet title="Reset Password | AAC" />

      <Typography component="h1" variant="h3" gutterBottom>
        Reset your password
      </Typography>

      <Typography component="h2" variant="body2" mt={2}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Typography>

      <Formik
        initialValues={{
          email: "",
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please enter a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={handleSubmit}
      >
        {(formProps) => <InnerForm {...formProps} />}
      </Formik>
      <Typography variant="h4" align="center">
        Already a member?
        <Link
          component={RouterLink}
          to="/auth/sign-in"
          color="secondary"
          ml={2}
        >
          Login
        </Link>
      </Typography>
    </Box>
  );
};
