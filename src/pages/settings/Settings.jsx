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

      <Grid container spacing={2} mb={5}>
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

      <Grid container spacing={2} mb={5}>
        <Grid item xs={10} sm={10}>
          <Typography variant="subtitle1">Input moves with keyboard</Typography>
          <Typography variant="body1" color="textSecondary">
            Input moves with keyboard
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Switch color="secondary" />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={5}>
        <Grid item xs={10} sm={10}>
          <Typography variant="subtitle1">Kid mode</Typography>
          <Typography variant="body1" color="textSecondary">
            We will disable chat and video sharing for kids, if you feel they
            should not be visible please enable this setting
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Switch color="secondary" />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={5}>
        <Grid item xs={10} sm={10}>
          <Typography variant="subtitle1">Two factor authentication</Typography>
          <Typography variant="body1" color="textSecondary">
            Activate two factor authentication, and make sure your account is
            safe and secure.
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Switch color="secondary" />
        </Grid>
      </Grid>
    </Box>
  );
};
