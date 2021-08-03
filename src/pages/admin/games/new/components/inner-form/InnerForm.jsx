import React, { useMemo } from "react";

import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
} from "components/material-ui";
import {
  SmallTextField,
  FormSelect,
  PlayerAutoComplete,
} from "components/common";
import { FitedForm } from "./styles";
import { TournamentVariants } from "constant";
import { getRatingCategory } from "utils/common";

export const InnerForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    dirty,
    values,
    handleSubmit,
  } = props;

  const VariantList = useMemo(
    () => [
      {
        label: "Standard",
        value: TournamentVariants.STANDARD,
      },
      {
        label: "Chess960",
        value: TournamentVariants.CHESS960,
      },
    ],
    []
  );

  return (
    <FitedForm noValidate onSubmit={handleSubmit}>
      <Box py={2} px={4} width="100%">
        <Box my={5} width="100%" display="flex" alignItems="flex-start">
          <Box width="50%">
            <FormControl
              error={Boolean(dirty && errors.white)}
              fullWidth
              onBlur={handleBlur}
            >
              <PlayerAutoComplete
                onBlur={handleBlur}
                onChange={(_event, newValue) => {
                  setFieldValue("white", newValue ? newValue.id : "");
                }}
                label="White Player"
              />

              {dirty && errors.white ? (
                <FormHelperText>{dirty && errors.white}</FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
        </Box>
        <Box my={5} width="100%" display="flex" alignItems="flex-start">
          <Box width="50%">
            <FormControl
              error={Boolean(dirty && errors.black)}
              fullWidth
              onBlur={handleBlur}
            >
              <PlayerAutoComplete
                onBlur={handleBlur}
                onChange={(_event, newValue) => {
                  setFieldValue("black", newValue ? newValue.id : "");
                }}
                label="Black Player"
              />

              {dirty && errors.black ? (
                <FormHelperText>{dirty && errors.black}</FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box my={3} width="50%">
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color="textSecondary">
              Chess Variant
            </Typography>
          </Box>
          <FormSelect
            variant="outlined"
            name="settings.variant"
            value={values.settings.variant}
            placeholder="Select a chess variant"
            displayEmpty
            options={VariantList}
            error={
              touched.settings &&
              errors.settings &&
              touched.settings.variant &&
              errors.settings.variant
            }
            fullWidth
            onChange={handleChange}
          />
        </Box>
        <Box my={3} width="50%">
          <Grid container spacing={5} my={1}>
            <Grid item sm={4}>
              <Typography color="textSecondary">Game time (min)</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textSecondary">Increment (sec)</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textSecondary">Time Control</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={5}>
            <Grid item sm={4}>
              <SmallTextField
                type="number"
                name="settings.startTime"
                variant="outlined"
                color="secondary"
                value={values.settings.startTime}
                error={Boolean(
                  touched.settings &&
                    touched.settings.startTime &&
                    errors.settings &&
                    errors.settings.startTime
                )}
                fullWidth
                helperText={
                  touched.settings &&
                  touched.settings.startTime &&
                  errors.settings &&
                  errors.settings.startTime
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid item sm={4}>
              <SmallTextField
                type="number"
                name="settings.increment"
                variant="outlined"
                color="secondary"
                value={values.settings.increment}
                error={Boolean(
                  touched.settings &&
                    touched.settings.increment &&
                    errors.settings &&
                    errors.settings.increment
                )}
                fullWidth
                helperText={
                  touched.settings &&
                  touched.settings.increment &&
                  errors.settings &&
                  errors.settings.increment
                }
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>

            <Grid item sm={4}>
              <Box display="flex" alignItems="center" height="100%">
                <Typography>
                  {getRatingCategory(
                    values.settings.startTime,
                    values.settings.increment
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box width="150px">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Game
          </Button>
        </Box>
      </Box>
    </FitedForm>
  );
};
