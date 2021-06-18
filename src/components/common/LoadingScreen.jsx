import React from "react";

import { Box, CircularProgress } from "components/material-ui";

export const LoadingScreen = (props) => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress m={2} color="secondary" />
      {props.children}
    </Box>
  );
};
