import React, { useCallback, useState, useMemo } from "react";

import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { VALID_USCF_LENGTH } from "constant";

import { updateMe } from "redux/reducers/authReducer";
import { setMessage } from "redux/reducers/messageReducer";
import UserService from "services/userService";

import { useTheme } from "@material-ui/core";
import { Box, Typography } from "components/material-ui";
import { InnerForm } from "./components";

export const Account = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);

  const [uscfData, setUscfData] = useState(user.ratings && user.ratings.uscf);
  const [uscfSubmitting, setUscfSubmitting] = useState(false);

  const initialValues = useMemo(
    () => ({
      email: user.email || "",
      name: user.name || "",
      username: user.username || "",
      uscf: (user.ratings && user.ratings.uscf && user.ratings.uscf.id) || "",
    }),
    [user]
  );

  const validateUSCFID = useCallback((value) => {
    if (!value || !value.length) return true;
    if (value.length !== VALID_USCF_LENGTH) return false;
    return /^\d+$/.test(value);
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      let formData = {
        id: user.id,
      };
      if (values.name.length) formData.name = values.name;
      if (values.username.length && values.username !== initialValues.username)
        formData.username = values.username;
      if (values.email.length && values.email !== initialValues.email)
        formData.email = values.email;
      if (values.uscf.length && values.uscf !== initialValues.uscf && uscfData)
        formData.uscf = values.uscf;
      dispatch(updateMe(formData));
    },
    [dispatch, uscfData, user, initialValues]
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

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      bgcolor={theme.palette.background.paper}
    >
      <Helmet title="Account" />
      <Typography variant="h3" mb={5}>
        Account
      </Typography>

      <Box pr={5} overflow="auto">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Please enter a valid email").max(255),
            name: Yup.string().max(255).required("Name is required"),
            username: Yup.string().max(255).required("UserName is required"),
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
              initialValues={initialValues}
              uscfData={uscfData}
              uscfSubmitting={uscfSubmitting}
              setUscfData={setUscfData}
              onUSCFSubmit={handleUSCFSubmit}
            />
          )}
        </Formik>
      </Box>
    </Box>
  );
};
