import React from "react";

import { Box } from "components/material-ui";

export const StepNumber = ({ status, step, ...props }) => {
  return (
    <Box
      borderRadius="100%"
      bgcolor={
        status === "active"
          ? "#2D62EB"
          : status === "verified"
          ? "#62AE00"
          : "#E9E9E9"
      }
      color={status === "active" || status === "verified" ? "white" : "#15375C"}
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
