import React from "react";

import { Box } from "@material-ui/core";
import ChessBoard from "components/ChessBoard";

const Play = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <h2>Play Page</h2>
      <ChessBoard />
    </Box>
  );
};

export default Play;
