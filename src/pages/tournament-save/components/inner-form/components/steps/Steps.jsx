import React from "react";

import { Box, Button, Typography } from "components/material-ui";
import { StepNumber } from "components/common";

export const Steps = (props) => {
  const {
    isSubmitting,
    isUpdate,
    width,
    right,
    top,
    activeStep,
    verified,
  } = props;
  const steps = [
    "General Information",
    "Tournament Settings",
    "Round and Match Settings",
  ];

  return (
    <Box position="absolute" right={right} top={top} width={width}>
      <Box
        border="2px solid rgba(255, 255, 255, 0.3)"
        borderRadius="10px"
        pt={4}
        px={3}
        pb={2}
      >
        <Typography variant="body1" mb={2}>
          Outline
        </Typography>
        {steps.map((step, index) => (
          <Box display="flex" alignItems="center" key={index} mb={2}>
            <StepNumber
              step={index + 1}
              active={activeStep === index}
              verified={verified[index]}
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
      </Box>
      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting || !verified[0] || !verified[1] || !verified[2]}
        variant="contained"
        color="primary"
        my={5}
      >
        {isUpdate ? "Update" : "Create"}
      </Button>
    </Box>
  );
};
