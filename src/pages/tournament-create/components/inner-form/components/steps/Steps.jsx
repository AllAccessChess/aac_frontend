import React from "react";

import { Box, Button, Typography } from "components/material-ui";
import { StepNumber } from "components/common";

export const Steps = (props) => {
  const { isSubmitting, width, activeStep } = props;
  const steps = [
    "General Information",
    "Tournament Settings",
    "Round and Match Settings",
  ];

  return (
    <Box position="absolute" right="0" top="0" width={width}>
      {steps.map((step, index) => (
        <Box display="flex" alignItems="center" key={index} mb={2}>
          <StepNumber
            step={index + 1}
            status={activeStep === index ? "active" : null}
            mr={2}
          />
          <Typography
            variant="body2"
            color={activeStep === index ? "textPrimary" : "textSecondary"}
          >
            {step}
          </Typography>
        </Box>
      ))}
      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
        variant="contained"
        color="primary"
        my={5}
      >
        Create
      </Button>
    </Box>
  );
};
