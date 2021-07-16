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
        type: "swiss",
        numRounds: 0,
        timeCategory: "classical",
        variant: 0,
        prepTime: 30000,
        ratingProvider: "uscf",
        rated: false,
        playup: 0,
        rounds: [],
        brackets: [],
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
          p={5}
          height="100%"
          borderRadius="0 0 10px 10px"
          overflow="auto"
          bgcolor={theme.palette.background.paper}
        >
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
                playup: Yup.number(),
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