import React from "react";

import {
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from "components/material-ui";
import { LightBlueTextColorButton, StepNumber } from "components/common";
import { CustomAccordion, CustomAccordionDetails } from "./styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import { FieldArray } from "formik";

export const Rounds = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
    setFieldValue,
    status,
    onOpen,
  } = props;

  return (
    <CustomAccordion
      expanded={status === "active"}
      bordercolor={status === "active" ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={onOpen}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber step={3} status={status} mr={2} />
            <Typography>Round and Match Settings</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Setup number of rounds, select time controls for them
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4} width="100%">
          <Typography variant="body1" mb={2}>
            Round Setup
          </Typography>
          <FieldArray
            name="settings.rounds"
            render={(arrayHelpers) => (
              <Box width="100%">
                <Grid container spacing={5} my={3}>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Round No.</Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Start Time</Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Duration</Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Increment</Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Game Type</Typography>
                  </Grid>
                </Grid>
                {values.settings.rounds.map((round, index) => (
                  <Grid key={index} container spacing={5} my={3}>
                    <Grid item sm={2}>
                      <Typography variant="subtitle1">{index + 1}</Typography>
                    </Grid>
                    <Grid item sm={2}>
                      <TextField
                        type="number"
                        name={`settings.rounds[${index}]['start']`}
                        label="Start Time"
                        variant="outlined"
                        color="secondary"
                        value={round.start}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index].start &&
                            errors.settings.rounds[index].start
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index].start &&
                          errors.settings.rounds[index].start
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={2}>
                      <TextField
                        type="number"
                        name={`settings.rounds[${index}]['startTime']`}
                        label="Time"
                        variant="outlined"
                        color="secondary"
                        value={round.startTime}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index].startTime &&
                            errors.settings.rounds[index].startTime
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index].startTime &&
                          errors.settings.rounds[index].startTime
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={2}>
                      <TextField
                        type="number"
                        name={`settings.rounds[${index}]['increment']`}
                        label="Increment"
                        variant="outlined"
                        color="secondary"
                        value={round.increment}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index].increment &&
                            errors.settings.rounds[index].increment
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index].increment &&
                          errors.settings.rounds[index].increment
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item sm={2}>
                      <TextField
                        type="text"
                        name={`settings.rounds[${index}]['timeCategory']`}
                        label="Game Type"
                        variant="outlined"
                        color="secondary"
                        value={round.timeCategory}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index].timeCategory &&
                            errors.settings.rounds[index].timeCategory
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index].timeCategory &&
                          errors.settings.rounds[index].timeCategory
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item sm={2}>
                      <Button
                        startIcon={<CloseIcon fontSize="small" />}
                        onClick={() => {
                          arrayHelpers.remove(index);
                          setFieldValue(
                            "settings.numRounds",
                            values.settings.numRounds - 1
                          );
                        }}
                      >
                        <Typography variant="body1">Remove</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <LightBlueTextColorButton
                  onClick={() => {
                    arrayHelpers.push({
                      start: -1,
                      timeCategory: "classical",
                      startTime: 0,
                      increment: 0,
                    });
                    setFieldValue(
                      "settings.numRounds",
                      values.settings.numRounds + 1
                    );
                  }}
                  color="primary"
                  startIcon={<AddIcon fontSize="small" />}
                >
                  Add Round
                </LightBlueTextColorButton>
              </Box>
            )}
          />
        </Box>
      </CustomAccordionDetails>
    </CustomAccordion>
  );
};
