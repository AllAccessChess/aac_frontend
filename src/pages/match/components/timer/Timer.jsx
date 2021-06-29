import React from "react";

import { useTheme } from "@material-ui/core";
import { AccessTime as AccessTimeIcon } from "@material-ui/icons";
import { Box, Typography } from "components/material-ui";

import { pad2 } from "utils/common";

export const Timer = (props) => {
  const { name, rating, clock } = props;
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={2}
      >
        <Typography variant="h5">{`${name}(${rating})`}</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#15375C"
          color={theme.palette.common.white}
          borderRadius={8}
          px={2}
          py={1}
        >
          <AccessTimeIcon />
          <Typography variant="h5">
            &nbsp;
            {pad2(Math.floor(clock / 60))}:{pad2(Math.floor(clock % 60))}
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
};
