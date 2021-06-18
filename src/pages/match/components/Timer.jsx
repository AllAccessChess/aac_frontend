import React from "react";
import styled from "styled-components";
import { useTheme } from "@material-ui/core";
import { AccessTime as AccessTimeIcon } from "@material-ui/icons";

import { Box, Typography } from "components/material-ui";

const VideoCanvas = styled.canvas`
  border-radius: 8px;
  background: black;
  transform: scaleX(-1);
  width: 100%;
`;

export const Timer = (props) => {
  const { match } = props;
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center">
        <VideoCanvas
          width={384}
          height={240}
          id={`${match.players[1].id}-video`}
        ></VideoCanvas>
        <Box my={3}>
          <Typography variant="h5">{match.players[1].name}(1200)</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={theme.palette.background.paper}
          width="100%"
          py={3}
          borderRadius={8}
        >
          <AccessTimeIcon />
          <Typography variant="h5">&nbsp;10:00</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={theme.palette.common.white}
          color={theme.palette.background.paper}
          width="100%"
          py={3}
          borderRadius={8}
        >
          <AccessTimeIcon />
          <Typography variant="h5">&nbsp;10:00</Typography>
        </Box>
        <Box my={3}>
          <Typography variant="h5">{match.players[0].name}(1400)</Typography>
        </Box>
        <VideoCanvas
          width={384}
          height={240}
          id={`${match.players[0].id}-video`}
        ></VideoCanvas>
      </Box>
    </React.Fragment>
  );
};
