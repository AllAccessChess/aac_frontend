import React, { useEffect } from "react";
import { FieldArray } from "formik";

import {
  AccordionSummary,
  Box,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Radio,
} from "components/material-ui";

import {
  LightBlueTextColorButton,
  SmallTextField,
  StepNumber,
  SmallHelpIcon,
  FormSelect,
} from "components/common";
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomSmallTextField,
  HoriziontalRadioGroup,
} from "./styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";

import {
  TimeControlOptions,
  TournamentTypeOptions,
  VariantOptions,
  RatingOptions,
} from "constant";

export const Sections = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
    active,
    verified,
    onNext,
    onOpen,
    onVerify,
  } = props;

  useEffect(() => {
    onVerify(
      !errors.settings ||
        (!errors.settings.type &&
          !errors.settings.ratingProvider &&
          !errors.settings.timeCategory &&
          !errors.settings.brackets)
    );
    // eslint-disable-next-line
  }, [errors.settings]);

  return (
    <CustomAccordion
      expanded={active}
      bordercolor={active ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={verified[0] ? onOpen : null}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber
              step={2}
              active={active}
              verified={verified[1]}
              mr={2}
            />
            <Typography>Tournament Settings</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Setup your tournament sections, pairing system, rating system
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4} width="100%">
          <Box width="100%">
            <Grid container spacing={5} my={3}>
              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Tournament Format
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <FormSelect
                  variant="outlined"
                  name="settings.type"
                  value={values.settings.type}
                  placeholder="Select a tournament format"
                  displayEmpty
                  options={TournamentTypeOptions}
                  error={
                    touched.settings &&
                    errors.settings &&
                    touched.settings.type &&
                    errors.settings.type
                  }
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>

              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Rating Provider
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <FormSelect
                  variant="outlined"
                  name="settings.ratingProvider"
                  value={values.settings.ratingProvider}
                  placeholder="Select a rating provider"
                  displayEmpty
                  options={RatingOptions}
                  error={
                    touched.settings &&
                    errors.settings &&
                    touched.settings.ratingProvider &&
                    errors.settings.ratingProvider
                  }
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>

              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Chess Variant
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <FormSelect
                  variant="outlined"
                  name="settings.variant"
                  value={values.settings.variant}
                  placeholder="Select a chess variant"
                  displayEmpty
                  options={VariantOptions}
                  error={
                    touched.settings &&
                    errors.settings &&
                    touched.settings.variant &&
                    errors.settings.variant
                  }
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>

              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Time Control
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <FormSelect
                  variant="outlined"
                  name="settings.ratingCategory"
                  value={values.settings.ratingCategory}
                  placeholder="Select a time control"
                  displayEmpty
                  options={TimeControlOptions}
                  error={
                    touched.settings &&
                    errors.settings &&
                    touched.settings.ratingCategory &&
                    errors.settings.ratingCategory
                  }
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mb={5}>
            <Typography variant="body1" color="textSecondary" mb={1}>
              Is this a rated event?
            </Typography>
            <HoriziontalRadioGroup
              name="settings.rated"
              value={values.settings.rated}
              onChange={handleChange}
            >
              <FormControlLabel
                value={true}
                control={<Radio color="primary" />}
                label="Yes"
              />
              <FormControlLabel
                value={false}
                control={<Radio color="primary" />}
                label="No"
              />
            </HoriziontalRadioGroup>
          </Box>

          <Box mb={5}>
            <Typography variant="body1" mb={1}>
              Create Sections
            </Typography>
            <FieldArray
              name="settings.brackets"
              render={(arrayHelpers) => (
                <Box width="100%">
                  <Grid container spacing={2} my={1}>
                    <Grid item sm={2}>
                      <Typography color="textSecondary">Min Rating</Typography>
                    </Grid>
                    <Grid item sm={1}></Grid>
                    <Grid item sm={2}>
                      <Typography color="textSecondary">Max Rating</Typography>
                    </Grid>
                  </Grid>
                  {values.settings.brackets.map((bracket, index) => (
                    <Grid key={index} container spacing={2} my={1}>
                      <Grid item sm={2}>
                        <SmallTextField
                          type="number"
                          name={`settings.brackets[${index}][0]`}
                          variant="outlined"
                          color="secondary"
                          value={bracket[0]}
                          error={Boolean(
                            touched.settings &&
                              touched.settings.brackets &&
                              errors.settings &&
                              errors.settings.brackets &&
                              touched.settings.brackets[index] &&
                              touched.settings.brackets[index][0] &&
                              errors.settings.brackets[index]
                          )}
                          fullWidth
                          helperText={
                            touched.settings &&
                            touched.settings.brackets &&
                            errors.settings &&
                            errors.settings.brackets &&
                            touched.settings.brackets[index] &&
                            touched.settings.brackets[index][0] &&
                            errors.settings.brackets[index] &&
                            (typeof errors.settings.brackets[index] === "string"
                              ? errors.settings.brackets[index]
                              : errors.settings.brackets[index][0])
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item sm={1}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                        >
                          <Typography color="textSecondary">To</Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={2}>
                        <SmallTextField
                          type="number"
                          name={`settings.brackets[${index}][1]`}
                          variant="outlined"
                          color="secondary"
                          value={bracket[1]}
                          error={Boolean(
                            touched.settings &&
                              touched.settings.brackets &&
                              errors.settings &&
                              errors.settings.brackets &&
                              touched.settings.brackets[index] &&
                              touched.settings.brackets[index][1] &&
                              errors.settings.brackets[index]
                          )}
                          fullWidth
                          helperText={
                            touched.settings &&
                            touched.settings.brackets &&
                            errors.settings &&
                            errors.settings.brackets &&
                            touched.settings.brackets[index] &&
                            touched.settings.brackets[index][1] &&
                            errors.settings.brackets[index] &&
                            (typeof errors.settings.brackets[index] === "string"
                              ? errors.settings.brackets[index]
                              : errors.settings.brackets[index][1])
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <Button
                          startIcon={<CloseIcon fontSize="small" />}
                          onClick={() => arrayHelpers.remove(index)}
                          size="small"
                        >
                          <Typography variant="body1">Remove</Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <LightBlueTextColorButton
                    onClick={() => arrayHelpers.push([0, 0])}
                    color="primary"
                    startIcon={<AddIcon fontSize="small" />}
                  >
                    Add Section
                  </LightBlueTextColorButton>
                </Box>
              )}
            />
          </Box>
          <Typography color="textSecondary">
            Allow playup within{" "}
            <CustomSmallTextField
              type="number"
              name="settings.playup"
              variant="outlined"
              color="secondary"
              value={values.settings.playup}
              error={Boolean(
                touched.settings &&
                  errors.settings &&
                  touched.settings.playup &&
                  errors.settings.playup
              )}
              helperText={
                touched.settings &&
                errors.settings &&
                touched.settings.playup &&
                errors.settings.playup
              }
              onBlur={handleBlur}
              onChange={handleChange}
            />{" "}
            rating points
          </Typography>
          {verified[1] ? (
            <Box width="150px">
              <Button
                variant="contained"
                color="primary"
                mt={5}
                fullWidth
                onClick={onNext}
              >
                Next
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </CustomAccordionDetails>
    </CustomAccordion>
  );
};
