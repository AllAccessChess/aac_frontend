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
          width={192}
          height={120}
          id={`${match.black.username}-video`}
        ></VideoCanvas>
        <Box my={3}>
          <Typography variant="h6">
            {match.black.name}({match.black.ratings.uscf.ratings.blitz.rating})
          </Typography>
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
          <Typography>10:00</Typography>
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
          <Typography>10:00</Typography>
        </Box>
        <Box my={3}>
          <Typography variant="h6">
            {match.white.name}({match.white.ratings.uscf.ratings.blitz.rating})
          </Typography>
        </Box>
        <VideoCanvas
          width={192}
          height={120}
          id={`${match.white.username}-video`}
        ></VideoCanvas>
      </Box>
    </React.Fragment>
  );
};
