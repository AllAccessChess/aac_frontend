import React from "react";
import styled from "styled-components";

import { Box, Typography } from "components/material-ui";

const Wrapper = styled(Box)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
`;

export const Scoreboard = (props) => {
  const { match, score } = props;
  return (
    <Wrapper p={3}>
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
