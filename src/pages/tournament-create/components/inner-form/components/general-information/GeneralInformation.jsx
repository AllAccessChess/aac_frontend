import React from "react";

import {
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "components/material-ui";
import { StepNumber } from "components/common";
import { CustomAccordion, CustomAccordionDetails } from "./styles";

export const GeneralInformation = (props) => {
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
  console.log(errors);

  return (
    <CustomAccordion
      expanded={status === "active"}
      bordercolor={status === "active" ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={onOpen}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber step={1} status={status} mr={2} />
            <Typography>General Information</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Lets get started with adding a name and description to your
            tournament
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4}>
          <TextField
            type="text"
            name="title"
            label="Tournament Name"
            variant="outlined"
            color="secondary"
            value={values.title}
            error={Boolean(touched.title && errors.title)}
            fullWidth
            helperText={touched.title && errors.title}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="organiser"
            label="Organiser"
            variant="outlined"
            color="secondary"
            value={values.organiser}
            error={Boolean(touched.organiser && errors.organiser)}
            fullWidth
            helperText={touched.organiser && errors.organiser}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
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
