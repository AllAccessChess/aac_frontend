import React from "react";

import { Link as RouterLink } from "react-router-dom";
import { Link } from "components/SpacedMui";
import { Box } from "@material-ui/core";

const Detail = () => {
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <h2>Tournament Detail Page</h2>
      <Link component={RouterLink} to="/tournaments/1/play">
        Playing Tournament 1
      </Link>
    </Box>
  );
};

export default Detail;
