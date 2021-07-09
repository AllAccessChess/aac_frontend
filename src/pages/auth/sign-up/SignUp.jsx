import React, { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import { config } from "config";
import { VALID_USCF_LENGTH } from "constant";
import { LichessButton } from "components/common";
import { Box, Button, Grid, Link, Typography } from "components/material-ui";
import { InnerForm } from "./components";
import { BackgroundWrapper, Logo } from "./styles";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/auth_background.png";

import { signUp, setUser } from "redux/reducers/authReducer";
import { setMessage } from "redux/reducers/messageReducer";
import UserService from "services/userService";

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
    (values, actions) => {
      let formData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      if (uscfData) formData.uscf = values.uscf;
      dispatch(signUp(formData, null, () => actions.setSubmitting(false)));
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
              Sign up with Lichess
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
