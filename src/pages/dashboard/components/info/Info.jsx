import React from "react";

import { Box, Grid, Typography } from "components/material-ui";
import { TextLabel } from "./styles";

export const Info = ({ label, value }) => (
  <Grid item md={4}>
    <Box mb={1}>
      <TextLabel>{label}</TextLabel>
    </Box>
    <Box mb={3}>
      <Typography>{value}</Typography>
    </Box>
  </Grid>
);
