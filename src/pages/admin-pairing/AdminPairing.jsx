import React, { useCallback, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { InnerForm } from "./components";
import { useTheme } from "@material-ui/core";
import { Box, Typography, Button } from "components/material-ui";
import { Close as CloseIcon } from "@material-ui/icons";

import { createGameWithTwoPlayers } from "redux/reducers/tournamentReducer";
import { getUserList } from "redux/reducers/userReducer";

export const AdminPairing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const users = useSelector((state) => state.userReducer.list);

  const initialValues = useMemo(
    () => ({
      white: "",
      black: "",
      settings: {
        startTime: 0,
        increment: 0,
        variant: 0,
      },
    }),
    []
  );

  const handleBack = useCallback(() => {
    history.push("/admin");
  }, [history]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(
      createGameWithTwoPlayers(
        values,
        () => {
          history.push("/admin");
        },
        () => {
          setSubmitting(false);
        }
      )
    );
  };

  useEffect(() => {
    if (!users.length) {
      dispatch(getUserList());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Helmet title="Pairing Two Players" />
      <Button startIcon={<CloseIcon fontSize="small" />} onClick={handleBack}>
        <Typography variant="body1">Close</Typography>
      </Button>

      <Box
        width="100%"
        height="calc(100% - 56px)"
        display="flex"
        flexDirection="column"
        borderRadius={10}
        my={4}
        bgcolor="#112C4A"
      >
        <Typography variant="h4" p={5}>
          Pairing Two Players
        </Typography>

        <Box
          height="calc(100% - 65px)"
          borderRadius="0 0 10px 10px"
          bgcolor={theme.palette.background.paper}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              white: Yup.string()
                .max(255)
                .required("Required")
                .min(1, "Required"),
              black: Yup.string()
                .max(255)
                .required("Required")
                .min(1, "Required")
                .when(["white"], (white, schema) => {
                  return schema.test({
                    test: (black) => white !== black,
                    message: "Shouldn't be same as white",
                  });
                }),
              settings: Yup.object().shape({
                startTime: Yup.number()
                  .required("Required")
                  .min(1, "Should be great than 0"),
                increment: Yup.number()
                  .required("Required")
                  .min(0, "Shouldn't be negative"),
                variant: Yup.number(),
              }),
            })}
            onSubmit={handleSubmit}
          >
            {(formProps) => <InnerForm {...formProps} users={users} />}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
