import React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";

import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@material-ui/core";
import {
  Alert,
  TextField,
  Button,
  Typography,
  Link,
} from "components/SpacedMui";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { signUp } from "redux/reducers/authReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
}));

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
  const classes = useStyles();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
        label="Email Address"
        variant="outlined"
        value={values.email}
        error={Boolean(touched.email && errors.email)}
        fullWidth
        helperText={touched.email && errors.email}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
      <TextField
        type="text"
        name="uscfId"
        label="Your USCF ID"
        variant="outlined"
        value={values.uscfId}
        error={Boolean(touched.uscfId && errors.uscfId)}
        fullWidth
        helperText={touched.uscfId && errors.uscfId}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        fullWidth
        error={Boolean(touched.password && errors.password)}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                color="secondary"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>

      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        fullWidth
        error={Boolean(
          touched.password_confirmation && errors.password_confirmation
        )}
      >
        <InputLabel htmlFor="password_confirmation">
          Re-enter password
        </InputLabel>
        <OutlinedInput
          id="password_confirmation"
          name="password_confirmation"
          type={showPassword ? "text" : "password"}
          value={values.password_confirmation}
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                color="secondary"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={120}
        />
        <FormHelperText id="confirm-password-helper-text">
          {errors.password_confirmation}
        </FormHelperText>
      </FormControl>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        size="large"
        my={5}
      >
        Sign Up
      </Button>
    </form>
  );
};

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      await dispatch(
        signUp({
          id: values._id,
          name: values.name,
          password: values.password,
        })
      );
    } catch (error) {
      const message = "Invalid email or password";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user]);

  return (
    <Box width="500px" padding={4}>
      <Helmet title="Sign Up" />

      <Typography component="h1" variant="h3" gutterBottom>
        Create an account
      </Typography>

      <Formik
        enableReinitialize
        initialValues={{
          email: "",
          password: "",
          password_confirmation: "",
          uscfId: "",
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          uscfId: Yup.string().max(255).required("USCF ID is required"),
          password: Yup.string()
            .min(8, "Must be at least 8 characters")
            .max(255)
            .required("Required"),
          password_confirmation: Yup.string().when("password", {
            is: (val) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
              [Yup.ref("password")],
              "Both password need to be the same"
            ),
          }),
        })}
        onSubmit={handleSubmit}
      >
        {(formProps) => <InnerForm {...formProps} />}
      </Formik>
      <Typography variant="h6" align="center">
        Already a member?
        <Link component={RouterLink} to="/auth/sign-in" color="primary" ml={2}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
