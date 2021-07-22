import React, { useEffect, useCallback } from "react";

import {
  AccordionSummary,
  Box,
  Button,
  Typography,
  Grid,
} from "components/material-ui";
import {
  LightBlueTextColorButton,
  StepNumber,
  SmallTextField,
} from "components/common";
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
    active,
    verified,
    onOpen,
    onVerify,
  } = props;

  const getRatingCategory = useCallback((startTime, increment) => {
    let x = startTime + increment;
    if (x < 3) return "Bullet";
    if (x < 10) return "Blitz";
    if (x < 30) return "Rapid";
    return "Classic";
  }, []);

  useEffect(() => {
    onVerify(!errors.settings || !errors.settings.rounds);
    // eslint-disable-next-line
  }, [errors.settings]);

  return (
    <CustomAccordion
      expanded={active}
      bordercolor={active ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={verified[0] && verified[1] ? onOpen : null}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber
              step={3}
              active={active}
              verified={verified[2]}
              mr={2}
            />
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
                  <Grid item sm={1}>
                    <Typography color="textSecondary">Round No.</Typography>
                  </Grid>
                  <Grid item sm={3}>
                    <Typography color="textSecondary">Start Time</Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">
                      Game time (min)
                    </Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">
                      Increment (min)
                    </Typography>
                  </Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Game Type</Typography>
                  </Grid>
                </Grid>
                {values.settings.rounds.map((round, index) => (
                  <Grid key={index} container spacing={5} my={3}>
                    <Grid item sm={1}>
                      <Typography variant="subtitle1">{index + 1}</Typography>
                    </Grid>
                    <Grid item sm={3}>
                      <SmallTextField
                        type="datetime-local"
                        name={`settings.rounds[${index}]['start']`}
                        variant="outlined"
                        placeholder="To be decided"
                        color="secondary"
                        value={
                          round.start > 0
                            ? new Date(round.start)
                                .toISOString()
                                .replace("Z", "")
                            : ""
                        }
                        error={Boolean(
                          touched.settings &&
                            errors.settings &&
                            touched.settings.rounds &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index] &&
                            errors.settings.rounds[index] &&
                            touched.settings.rounds[index].start &&
                            errors.settings.rounds[index].start
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          errors.settings &&
                          touched.settings.rounds &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index] &&
                          errors.settings.rounds[index] &&
                          touched.settings.rounds[index].start &&
                          errors.settings.rounds[index].start
                        }
                        onBlur={handleBlur}
                        onChange={(event) =>
                          setFieldValue(
                            `settings.rounds[${index}].start`,
                            new Date(event.target.value).getTime()
                          )
                        }
                      />
                    </Grid>
                    <Grid item sm={2}>
                      <SmallTextField
                        type="number"
                        name={`settings.rounds[${index}]['startTime']`}
                        variant="outlined"
                        color="secondary"
                        value={round.startTime}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index] &&
                            errors.settings.rounds[index] &&
                            touched.settings.rounds[index].startTime &&
                            errors.settings.rounds[index].startTime
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index] &&
                          errors.settings.rounds[index] &&
                          touched.settings.rounds[index].startTime &&
                          errors.settings.rounds[index].startTime
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={2}>
                      <SmallTextField
                        type="number"
                        name={`settings.rounds[${index}]['increment']`}
                        variant="outlined"
                        color="secondary"
                        value={round.increment}
                        error={Boolean(
                          touched.settings &&
                            touched.settings.rounds &&
                            errors.settings &&
                            errors.settings.rounds &&
                            touched.settings.rounds[index] &&
                            errors.settings.rounds[index] &&
                            touched.settings.rounds[index].increment &&
                            errors.settings.rounds[index].increment
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.rounds &&
                          errors.settings &&
                          errors.settings.rounds &&
                          touched.settings.rounds[index] &&
                          errors.settings.rounds[index] &&
                          touched.settings.rounds[index].increment &&
                          errors.settings.rounds[index].increment
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item sm={2}>
                      <Box display="flex" alignItems="center">
                        <Typography>
                          {getRatingCategory(round.startTime, round.increment)}
                        </Typography>
                      </Box>
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
