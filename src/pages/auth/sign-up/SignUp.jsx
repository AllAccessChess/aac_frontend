import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle as FaTimesCircleIcon } from "@fortawesome/free-solid-svg-icons";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import { config } from "config";
import { VALID_USCF_LENGTH } from "constant";
import { LichessButton, Spinner } from "components/common";
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
import { signUp, setUser } from "redux/reducers/authReducer";
import { setMessage } from "redux/reducers/messageReducer";
import UserService from "services/userService";
import { useStyles, BackgroundWrapper, EmptyWrapper, Logo } from "./styles";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/auth_background.png";

const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
    setFieldValue,
    uscfData,
    setUscfData,
    uscfSubmitting,
    onUSCFSubmit,
  } = props;
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = useCallback(() => {
    setShowPassword((origin) => !origin);
  }, [setShowPassword]);
  const handleMouseDownPassword = useCallback(
    (event) => event.preventDefault(),
    []
  );
  const handleUSCFChange = useCallback(
    (event) => {
      const uscfValue = event.target.value;
      setFieldValue("uscf", uscfValue);
      if (uscfValue && uscfValue.length === VALID_USCF_LENGTH) {
        onUSCFSubmit(uscfValue);
      }
    },
    [setFieldValue, onUSCFSubmit]
  );
  const handleClearUSCF = useCallback(() => {
    setFieldValue("uscf", "");
    setUscfData(null);
  }, [setFieldValue, setUscfData]);

  return (
    <form noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        type="text"
        name="name"
        label="Name"
        variant="outlined"
        color="secondary"
        value={values.name}
        error={Boolean(touched.name && errors.name)}
        fullWidth
        helperText={touched.name && errors.name}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
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
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
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

      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        color="secondary"
        fullWidth
        error={Boolean(
          touched.password_confirmation && errors.password_confirmation
        )}
      >
        <InputLabel htmlFor="password_confirmation">
          Confirm Password
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
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={120}
        />
        <FormHelperText id="confirm-password-helper-text">
          {errors.password_confirmation}
        </FormHelperText>
      </FormControl>

      <TextField
        type="text"
        name="uscf"
        label="USCF ID"
        variant="outlined"
        color="secondary"
        disabled={uscfSubmitting}
        value={values.uscf}
        error={Boolean(touched.uscf && errors.uscf)}
        fullWidth
        helperText={touched.uscf && errors.uscf}
        onBlur={handleBlur}
        onChange={handleUSCFChange}
        my={3}
      />

      {!uscfData || uscfSubmitting ? (
        <EmptyWrapper>
          {uscfSubmitting ? (
            <Spinner />
          ) : (
            <Typography variant="body2">Fetched USCF Profile</Typography>
          )}
        </EmptyWrapper>
      ) : (
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexDirection="column"
          borderRadius={4}
          bgcolor="#15375C"
          position="relative"
          mt={5}
          p={4}
        >
          <Typography variant="h4" mb={2}>
            {uscfData.metadata.name}
          </Typography>
          <Typography variant="h5">{uscfData.id}</Typography>
          <Box position="absolute" right={-20} top={-20}>
            <IconButton onClick={handleClearUSCF}>
              <FontAwesomeIcon icon={FaTimesCircleIcon} />
            </IconButton>
          </Box>
        </Box>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        disabled={isSubmitting}
        size="large"
        my={5}
      >
        Sign Up
      </Button>
    </form>
  );
};

export const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);
  const [uscfData, setUscfData] = useState();
  const [uscfSubmitting, setUscfSubmitting] = useState(false);

  const validateUSCFID = useCallback((value) => {
    if (!value || !value.length) return true;
    if (value.length !== VALID_USCF_LENGTH) return false;
    return /^\d+$/.test(value);
  }, []);
  const handleSubmit = useCallback(
    (values) => {
      let formData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      if (uscfData) formData.uscf = values.uscf;
      dispatch(signUp(formData));
    },
    [dispatch, uscfData]
  );
  const handleUSCFSubmit = useCallback(
    async (uscfID) => {
      setUscfSubmitting(true);
      try {
        const response = await UserService.getUSCFData(uscfID);
        if (response.status !== "ok") {
          dispatch(setMessage({ message: response.error }));
        } else {
          setUscfData(response.ratings);
        }
      } catch (error) {
        dispatch(setMessage({ message: error.message }));
      }
      setUscfSubmitting(false);
    },
    [dispatch, setUscfSubmitting, setUscfData]
  );
  const handleGuestLogin = useCallback(() => {
    dispatch(setUser({ name: "Guest" }));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <>
      <Helmet title="Sign Up" />
      <Grid item xs={12} sm={6}>
        <Box
          display="flex"
          flexDirection="column"
          px={{ xs: 5, sm: 10, md: 20 }}
          py={{ xs: 4, sm: 7, md: 10 }}
          bgcolor="#134378"
          height="100%"
        >
          <Box display="flex" justifyContent="space-between" mb={5}>
            <Link component={RouterLink} to="/">
              <Logo src={logoImg} />
            </Link>
            <Button color="secondary" size="large" onClick={handleGuestLogin}>
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
              Signup with Lichess
            </LichessButton>
            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              my={{ xs: 3, sm: 4, md: 7 }}
            >
              or
            </Typography>
            <Formik
              enableReinitialize
              initialValues={{
                email: "",
                password: "",
                password_confirmation: "",
                name: "",
                uscf: "",
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Please enter a valid email")
                  .max(255)
                  .required("Email is required"),
                name: Yup.string().max(255).required("Name is required"),
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
                uscf: Yup.string().test(
                  "Invalid USCF ID",
                  "Invalid USCF ID",
                  validateUSCFID
                ),
              })}
              onSubmit={handleSubmit}
            >
              {(formProps) => (
                <InnerForm
                  {...formProps}
                  uscfData={uscfData}
                  uscfSubmitting={uscfSubmitting}
                  setUscfData={setUscfData}
                  onUSCFSubmit={handleUSCFSubmit}
                />
              )}
            </Formik>

            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              mt={{ xs: 3, sm: 4, md: 5 }}
            >
              Already have an account?
              <Link
                component={RouterLink}
                to="/auth/sign-in"
                color="secondary"
                ml={2}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <BackgroundWrapper
        item
        xs={12}
        sm={6}
        background={backgroundImg}
      ></BackgroundWrapper>
    </>
  );
};
