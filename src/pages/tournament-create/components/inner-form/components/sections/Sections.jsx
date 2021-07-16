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

export const Sections = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
    status,
    onNext,
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
            <StepNumber step={2} status={status} mr={2} />
            <Typography>Tournament Settings</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Setup your tournament sections, pairing system, rating system
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4} width="100%">
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
                      <TextField
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
                            touched.settings.brackets[index][0] &&
                            errors.settings.brackets[index][0]
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.brackets &&
                          errors.settings &&
                          errors.settings.brackets &&
                          touched.settings.brackets[index][0] &&
                          errors.settings.brackets[index][0]
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item sm={1}>
                      <Typography color="textSecondary">To</Typography>
                    </Grid>
                    <Grid item sm={2}>
                      <TextField
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
                            touched.settings.brackets[index][1] &&
                            errors.settings.brackets[index][1]
                        )}
                        fullWidth
                        helperText={
                          touched.settings &&
                          touched.settings.brackets &&
                          errors.settings &&
                          errors.settings.brackets &&
                          touched.settings.brackets[index][1] &&
                          errors.settings.brackets[index][1]
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
          <Box width="150px">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </CustomAccordionDetails>
    </CustomAccordion>
  );
};
