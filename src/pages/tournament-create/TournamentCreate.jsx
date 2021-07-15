import React, { useMemo, useCallback } from "react";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import { useTheme } from "@material-ui/core";
import { Box, Typography, Button } from "components/material-ui";
import { ChevronLeft as BackIcon } from "@material-ui/icons";
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
        type: "swiss",
        numRounds: 0,
        timeCategory: "classical",
        variant: 0,
        prepTime: 30000,
        ratingProvider: "uscf",
        rated: false,
        rounds: [],
        brackets: [
          [0, 1200],
          [1200, 1500],
        ],
      },
      restrictions: {},
      start: 1629318550012,
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
      <Button startIcon={<BackIcon />} onClick={handleBack}>
        Go Back
      </Button>

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        borderRadius={10}
        p={5}
        m={4}
        bgcolor={theme.palette.background.paper}
      >
        <Helmet title="Account" />
        <Typography variant="h3" mb={5}>
          Create a new tournament
        </Typography>

        <Box pr={5} overflow="auto">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .max(255)
                .required("Tournament Name is Required"),
              organiser: Yup.string().max(255).required(),
              start: Yup.number().required(),
              settings: Yup.object().shape({
                type: Yup.string().required(),
                numRounds: Yup.number().min(1),
                timeCategory: Yup.string().required(),
                variant: Yup.number(),
                prepTime: Yup.number(),
                ratingProvider: Yup.string().required(),
                rated: Yup.boolean(),
                rounds: Yup.array()
                  .ensure()
                  .compact()
                  .of(
                    Yup.object().shape({
                      start: Yup.number(),
                      timeCategory: Yup.string().required(),
                      startTime: Yup.number(),
                      increment: Yup.number(),
                    })
                  ),
                brackets: Yup.array()
                  .ensure()
                  .compact()
                  .of(Yup.array().min(2).max(2).of(Yup.number())),
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
