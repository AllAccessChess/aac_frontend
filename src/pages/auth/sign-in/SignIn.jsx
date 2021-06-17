import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import { config } from "config";
import { LichessButton } from "components/common";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "components/material-ui";
import { signIn, setUser } from "redux/reducers/authReducer";
import { FullForm, Logo, BackgroundWrapper, useStyles } from "./styles";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/login_background.jpg";

const InnerForm = (props) => {
  const {
    errors,
    isSubmitting,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  } = props;

  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FullForm noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        autoComplete="off"
        type="email"
        name="id"
        label="Email"
        variant="outlined"
        color="secondary"
        value={values.id}
        error={Boolean(touched.id && errors.id)}
        fullWidth
        helperText={touched.id && errors.id}
        onBlur={handleBlur}
        onChange={handleChange}
        my={2}
      />
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
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
                color="default"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>
      {/* <Link component={RouterLink} to="/auth/reset-password" color="secondary">
        Forgot password?
      </Link> */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        size="large"
        disabled={isSubmitting}
        my={5}
      >
        Log in
      </Button>
    </FullForm>
  );
};

export const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);

  React.useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      dispatch(signIn({ id: values.id, password: values.password }));
    } catch (error) {
      const message = "Invalid Data";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };
  const handleGuestLogin = useCallback(() => {
    dispatch(setUser({ name: "Guest" }));
  }, [dispatch]);
  return (
    <>
      <Helmet title="Sign In" />
      <Grid item xs={12} sm={6}>
        <Box
          display="flex"
          flexDirection="column"
          px={{ xs: 5, sm: 10, md: 20 }}
          py={{ xs: 4, sm: 7, md: 10 }}
          height="100%"
          bgcolor="#134378"
        >
          <Box display="flex" justifyContent="space-between" mb={5}>
            <Link component={RouterLink} to="/">
              <Logo src={logoImg} />
            </Link>
            <Button onClick={handleGuestLogin} color="secondary" size="large">
              Continue as a guest
            </Button>
          </Box>
          <Box
            display="flex"
            width="100%"
            height="100%"
            padding={1}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <LichessButton
              color="default"
              size="large"
              fullWidth
              onClick={() =>
                (window.location.href = `${config.apiURL}/auth/lichess`)
              }
            >
              Login with Lichess
            </LichessButton>
            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              my={7}
            >
              or
            </Typography>
            <Formik
              initialValues={{
                id: "",
                password: "",
                submit: false,
              }}
              validationSchema={Yup.object().shape({
                id: Yup.string().max(255).required("Email is required"),
                password: Yup.string()
                  .max(255)
                  .required("Password is required"),
              })}
              onSubmit={handleSubmit}
            >
              {(formProps) => <InnerForm {...formProps} />}
            </Formik>

            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              mt={5}
            >
              Not a member yet?
              <Link
                component={RouterLink}
                to="/auth/sign-up"
                color="secondary"
                ml={2}
              >
                Signup
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <BackgroundWrapper
        item
        xs={12}
        sm={6}
        height="100%"
        background={backgroundImg}
      ></BackgroundWrapper>
    </>
  );
};
