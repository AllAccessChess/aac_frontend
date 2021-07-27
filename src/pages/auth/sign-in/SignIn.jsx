import React, { useCallback } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { config } from "config";
import { LichessButton } from "components/common";
import { Box, Button, Grid, Link, Typography } from "components/material-ui";
import { InnerForm } from "./components";
import { BackgroundWrapper, Logo, StyledGoogleLogin } from "./styles";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/auth_background.png";

import { signIn } from "redux/reducers/authReducer";

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

  const responseGoogle = (response) => {
    console.log(response);
  };

  const handleGuestLogin = useCallback(() => {
    history.push("/tournaments");
  }, [history]);

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
            <StyledGoogleLogin
              clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
              buttonText="Log in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
            <LichessButton
              color="default"
              size="large"
              fullWidth
              onClick={() =>
                (window.location.href = `${config.apiURL}/auth/lichess`)
              }
            >
              Log in with Lichess
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
                Sign up
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
