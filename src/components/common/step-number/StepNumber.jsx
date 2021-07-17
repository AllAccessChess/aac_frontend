import React from "react";

import { Box } from "components/material-ui";

export const StepNumber = ({ active, verified, step, ...props }) => {
  return (
    <Box
      borderRadius="100%"
      bgcolor={active ? "#2D62EB" : verified ? "#62AE00" : "#E9E9E9"}
      color={active || verified ? "white" : "#15375C"}
      fontSize="14px"
      width="20px"
      padding="0px 6px"
      textAlign="center"
      {...props}
    >
      {step}
    </Box>
  );
};
