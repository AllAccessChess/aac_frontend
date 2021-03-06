import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";

import { Box, Button, Typography } from "components/material-ui";

export const Page500 = () => {
  return (
    <Box bgColor="transparent" p={{ sm: 10, md: 6 }}>
      <Helmet title="500 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        500
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Internal server error.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        The server encountered something unexpected that didn't allow it to
        complete the request.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        Return to website
      </Button>
    </Box>
  );
};
