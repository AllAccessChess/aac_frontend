import React, { useMemo, useCallback } from "react";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import { useTheme } from "@material-ui/core";
import { Box, Typography, Button } from "components/material-ui";
import { Close as CloseIcon } from "@material-ui/icons";
import { InnerForm } from "./components";

import { createTournament } from "redux/reducers/tournamentReducer";

export const TournamentCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const initialValues = useMemo(
    () => ({
      title: "",
      organiser: "",
      state: 1,
      settings: {
        type: "",
        ratingCategory: "",
        ratingProvider: "",
        playup: 0,
        variant: 0,
        prepTime: 30000,
        rated: false,
        numRounds: 0,
        rounds: [],
        brackets: [],
      },
      restrictions: {},
      start: 0,
      hidden: false,
    }),
    []
  );

  const handleBack = useCallback(() => {
    history.push("/tournaments");
  }, [history]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(
      createTournament(
        values,
        () => {
          history.push("/tournaments");
        },
        () => {
          setSubmitting(false);
        }
      )
    );
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Helmet title="Create Tournament" />
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
          Create a new tournament
        </Typography>

        <Box
          height="calc(100% - 65px)"
          borderRadius="0 0 10px 10px"
          bgcolor={theme.palette.background.paper}
        >
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .max(255)
                .required("Tournament Name is Required"),
              organiser: Yup.string()
                .max(255)
                .required("Organiser is Required"),
              start: Yup.number().min(1, "Invalid Date"),
              settings: Yup.object().shape({
                type: Yup.string().required("Required"),
                numRounds: Yup.number().min(
                  1,
                  "Should have at least one round"
                ),
                ratingCategory: Yup.string().required("Required"),
                variant: Yup.number(),
                prepTime: Yup.number(),
                ratingProvider: Yup.string().required("Required"),
                rated: Yup.boolean(),
                playup: Yup.number().min(0, "Shouln't be negative"),
                rounds: Yup.array()
                  .ensure()
                  .compact()
                  .min(1)
                  .of(
                    Yup.object().shape({
                      start: Yup.number(),
                      startTime: Yup.number().min(1, "Must be greater than 0"),
                      increment: Yup.number().min(0, "Shouldn't be negative"),
                    })
                  ),
                brackets: Yup.array().of(
                  Yup.array()
                    .min(1)
                    .max(2)
                    .of(
                      Yup.number()
                        .required("Required")
                        .min(0, "Shouldn't be negative")
                    )
                    .test(
                      "bracket-validator",
                      "Max Rating should be greater than Min Rating",
                      (value) => value[1] >= value[0]
                    )
                ),
              }),
              restrictions: Yup.object(),
              hidden: Yup.boolean(),
            })}
            validate={(values) => {
              console.log(values);
            }}
            onSubmit={handleSubmit}
          >
            {(formProps) => (
              <InnerForm {...formProps} initialValues={initialValues} />
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
