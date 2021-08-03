import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core";

import { Box, Grid, Typography } from "components/material-ui";
import adminFeatures from "data/admin-features";
import { isAdmin } from "utils/common";

import { Block } from "./components";

export const Admin = () => {
  const history = useHistory();
  const theme = useTheme();
  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    if (user && user.id && !isAdmin(user)) {
      history.push("/tournaments");
    }
  }, [user, history]);

  const handleClickBlock = (url) => {
    history.push(url);
  };

  return (
    <Box
      width="100%"
      position="relative"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="h3" component="h3" mb={5}>
        Admin Panel
      </Typography>
      <Grid container spacing={5}>
        {adminFeatures.map(({ id, title, description, url }) => (
          <Grid item md={6} sm={12} key={id}>
            <Block
              title={title}
              description={description}
              url={url}
              onClick={handleClickBlock}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
