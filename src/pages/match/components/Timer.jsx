import React from "react";
import styled from "styled-components";
import { useTheme } from "@material-ui/core";
import { AccessTime as AccessTimeIcon } from "@material-ui/icons";

import { Box, Typography } from "components/material-ui";
import { pad2 } from "utils/common";

const VideoCanvas = styled.canvas`
  border-radius: 8px;
  background: black;
  transform: scaleX(-1);
  width: 100%;
`;

export const Timer = (props) => {
  const { match, playerColor, whiteClock, blackClock } = props;
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center">
        <VideoCanvas
          width={384}
          height={240}
          id={
            playerColor
              ? `${match.players[0].id}-video`
              : `${match.players[1].id}-video`
          }
        ></VideoCanvas>
        <Box my={3}>
          <Typography variant="h5">
            {playerColor
              ? `${match.players[0].name}(${match.players[0].rating})`
              : `${match.players[1].name}(${match.players[1].rating})`}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={
            playerColor
              ? theme.palette.common.white
              : theme.palette.background.paper
          }
          color={
            playerColor
              ? theme.palette.background.paper
              : theme.palette.common.white
          }
          width="100%"
          py={3}
          borderRadius={8}
        >
          <AccessTimeIcon />
          <Typography variant="h5">
            &nbsp;
            {playerColor
              ? pad2(Math.floor(whiteClock / 60))
              : pad2(Math.floor(blackClock / 60))}
            :
            {playerColor
              ? pad2(Math.floor(whiteClock % 60))
              : pad2(Math.floor(blackClock % 60))}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={
            playerColor
              ? theme.palette.background.paper
              : theme.palette.common.white
          }
          color={
            playerColor
              ? theme.palette.common.white
              : theme.palette.background.paper
          }
          width="100%"
          py={3}
          borderRadius={8}
        >
          <AccessTimeIcon />
          <Typography variant="h5">
            &nbsp;
            {playerColor
              ? pad2(Math.floor(blackClock / 60))
              : pad2(Math.floor(whiteClock / 60))}
            :
            {playerColor
              ? pad2(Math.floor(blackClock % 60))
              : pad2(Math.floor(whiteClock % 60))}
          </Typography>
        </Box>
        <Box my={3}>
          <Typography variant="h5">
            {playerColor
              ? `${match.players[1].name}(${match.players[1].rating})`
              : `${match.players[0].name}(${match.players[0].rating})`}
          </Typography>
        </Box>
        <VideoCanvas
          width={384}
          height={240}
          id={
            playerColor
              ? `${match.players[1].id}-video`
              : `${match.players[0].id}-video`
          }
        ></VideoCanvas>
      </Box>
    </React.Fragment>
  );
};
