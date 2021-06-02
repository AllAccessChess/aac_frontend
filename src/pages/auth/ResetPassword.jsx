import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";

import { Box } from "@material-ui/core";
import {
  Alert,
  TextField,
  Button,
  Link,
  Typography,
} from "components/SpacedMui";

import { setMessage } from "redux/reducers/messageReducer";

const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = props;
  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        type="email"
        name="email"
        label="Email"
        variant="outlined"
        color="secondary"
        value={values.email}
        error={Boolean(touched.email && errors.email)}
        fullWidth
        helperText={touched.email && errors.email}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
      <Box my={5}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isSubmitting}
          size="large"
        >
          Continue
        </Button>
      </Box>
    </form>
  );
};

const ResetPassword = () => {
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

export default ResetPassword;
