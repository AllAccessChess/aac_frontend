import React from "react";
import { Helmet } from "react-helmet";

import { useTheme } from "@material-ui/core";
import { Box, Typography, Switch, Grid } from "components/material-ui";

export const Settings = () => {
  const theme = useTheme();
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      m={4}
      bgcolor={theme.palette.background.paper}
    >
      <Helmet title="Settings" />
      <Typography variant="h3" mb={5}>
        Settings
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={10} sm={10}>
          <Typography variant="subtitle1">
            Allow anonymous users to view your stream
          </Typography>
          <Typography variant="body1" color="textSecondary">
            By default we do not stream your video to users who are not a
            certified member of the platform
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Switch color="secondary" />
        </Grid>
      </Grid>
    </Box>
  );
};
