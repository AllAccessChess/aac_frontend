import React from "react";
import { Box } from "@material-ui/core";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3} display="flex" flexDirection="column">
          {children}
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
