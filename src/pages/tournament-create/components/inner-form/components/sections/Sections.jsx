import React, { useEffect, useMemo } from "react";
import { FieldArray } from "formik";

import {
  AccordionSummary,
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
} from "components/material-ui";

import {
  LightBlueTextColorButton,
  SmallTextField,
  StepNumber,
  SmallHelpIcon,
} from "components/common";
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomSelect,
  CustomSmallTextField,
} from "./styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";

import { TournamentTypes, RatingProviders, TimeCategories } from "constant";

export const Sections = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
    active,
    verified,
    dirty,
    onNext,
    onOpen,
    onVerify,
  } = props;

  const PairingList = useMemo(
    () => [
      {
        label: "Swiss",
        value: TournamentTypes.SWISS,
      },
    ],
    []
  );
  const RatingList = useMemo(
    () => [
      {
        label: "USCF",
        value: RatingProviders.USCF,
      },
      {
        label: "FIDE",
        value: RatingProviders.FIDE,
      },
      {
        label: "Lichess",
        value: RatingProviders.LICHESS,
      },
      {
        label: "AAC",
        value: RatingProviders.AAC,
      },
    ],
    []
  );
  const GameTypeList = useMemo(
    () => [
      {
        label: "Bullet",
        value: TimeCategories.BULLET,
      },
      {
        label: "Blitz",
        value: TimeCategories.BLITZ,
      },
      {
        label: "Rapid",
        value: TimeCategories.RAPID,
      },
      {
        label: "Classic",
        value: TimeCategories.CLASSIC,
      },
      {
        label: "Blitz OTB",
        value: TimeCategories.BLITZOTB,
      },
      {
        label: "Rapid OTB",
        value: TimeCategories.RAPIDOTB,
      },
      {
        label: "Classic OTB",
        value: TimeCategories.CLASSICOTB,
      },
    ],
    []
  );

  useEffect(() => {
    onVerify(
      dirty &&
        (!errors.settings ||
          (!errors.settings.type &&
            !errors.settings.ratingProvider &&
            !errors.settings.timeCategory &&
            !errors.settings.brackets))
    );
    // eslint-disable-next-line
  }, [errors.settings, dirty]);

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
              <Grid item sm={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Pairing Type
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <CustomSelect
                  variant="outlined"
                  name="settings.type"
                  value={values.settings.type}
                  error={Boolean(
                    touched.settings &&
                      errors.settings &&
                      touched.settings.type &&
                      errors.settings.type
                  )}
                  fullWidth
                  helperText={
                    touched.settings &&
                    errors.settings &&
                    touched.settings.type &&
                    errors.settings.type
                  }
                  onChange={handleChange}
                >
                  <MenuItem disabled value="">
                    <em>Select a pairing type</em>
                  </MenuItem>
                  {RatingList.map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item sm={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Rating Provider
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <CustomSelect
                  variant="outlined"
                  name="settings.ratingProvider"
                  value={values.settings.ratingProvider}
                  fullWidth
                  onChange={handleChange}
                >
                  <MenuItem disabled value="">
                    <em>Select a rating provider</em>
                  </MenuItem>
                  {PairingList.map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item sm={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Game Type
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <CustomSelect
                  variant="outlined"
                  name="settings.timeCategory"
                  value={values.settings.timeCategory}
                  fullWidth
                  onChange={handleChange}
                >
                  <MenuItem disabled value="">
                    <em>Select a game type</em>
                  </MenuItem>
                  {GameTypeList.map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="body1" mb={2}>
            Create Sections
          </Typography>
          <FieldArray
            name="settings.brackets"
            render={(arrayHelpers) => (
              <Box width="100%">
                <Grid container spacing={5} my={3}>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Min Rating</Typography>
                  </Grid>
                  <Grid item sm={1}></Grid>
                  <Grid item sm={2}>
                    <Typography color="textSecondary">Max Rating</Typography>
                  </Grid>
                </Grid>
                {values.settings.brackets.map((bracket, index) => (
                  <Grid key={index} container spacing={5} my={3}>
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
                            (errors.settings.brackets[index] ||
                              errors.settings.brackets[index][0])
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.brackets &&
                          errors.settings &&
                          errors.settings.brackets &&
                          touched.settings.brackets[index] &&
                          touched.settings.brackets[index][0] &&
                          (errors.settings.brackets[index] ||
                            errors.settings.brackets[index][0])
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={1}>
                      <Typography color="textSecondary">To</Typography>
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
                            (errors.settings.brackets[index] ||
                              errors.settings.brackets[index][1])
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.brackets &&
                          errors.settings &&
                          errors.settings.brackets &&
                          touched.settings.brackets[index] &&
                          touched.settings.brackets[index][1] &&
                          (errors.settings.brackets[index] ||
                            errors.settings.brackets[index][1])
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={2}>
                      <Button
                        startIcon={<CloseIcon fontSize="small" />}
                        onClick={() => arrayHelpers.remove(index)}
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
