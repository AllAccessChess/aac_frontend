import React from "react";

import { Box } from "components/material-ui";

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...other}
      overflow="auto"
      pr={2}
    >
      {value === index && (
        <Box py={3} display="flex" flexDirection="column">
          {children}
        </Box>
      )}
    </Box>
  );
};
