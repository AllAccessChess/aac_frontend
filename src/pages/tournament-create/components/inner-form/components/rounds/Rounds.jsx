import React, { useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Typography,
  IconButton,
} from "components/material-ui";
import {
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddCircleIcon,
} from "@material-ui/icons";
import { FieldArray } from "formik";

export const Rounds = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
    values,
    setFieldValue,
  } = props;
  const [expanded, setExpanded] = useState(true);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Rounds</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FieldArray
          name="settings.rounds"
          render={(arrayHelpers) => (
            <Box>
              {values.settings.rounds.map((round, index) => (
                <Box key={index}>
                  <Typography variant="subtitle1">Round {index + 1}</Typography>
                  <TextField
                    type="text"
                    name={`settings.rounds[${index}]['timeCategory']`}
                    label="Time Category"
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
                    my={3}
                  />
                  <TextField
                    type="number"
                    name={`settings.rounds[${index}]['startTime']`}
                    label="Start Time"
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
                    helperText={touched.startTime && errors.startTime}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={3}
                  />
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
                    my={3}
                  />
                </Box>
              ))}
              <IconButton
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
                variant="contained"
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
          )}
        />
      </AccordionDetails>
    </Accordion>
  );
};
