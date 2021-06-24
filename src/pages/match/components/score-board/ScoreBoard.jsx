import React from "react";

import { Box, Typography } from "components/material-ui";
import { Wrapper } from "./styles";

export const ScoreBoard = (props) => {
  const { match, score, playerColor } = props;
  return (
    <Wrapper
      p={3}
      display="flex"
      flexDirection={playerColor ? "column-reverse" : "column"}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography>{match.players[1].name}</Typography>
        <Typography>{score.black}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>{match.players[0].name}</Typography>
        <Typography>{score.white}</Typography>
      </Box>
    </Wrapper>
  );
};
