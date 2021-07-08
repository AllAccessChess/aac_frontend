import React from "react";

import { Typography, Switch, Grid } from "components/material-ui";

export const SwitchField = ({ title, description, value, onChange }) => {
  return (
    <Grid container spacing={2} mb={5}>
      <Grid item xs={10} sm={10}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1" color="textSecondary">
          {description}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Switch
          color="secondary"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
      </Grid>
    </Grid>
  );
};
