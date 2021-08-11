import React from "react";
import { useTheme } from "@material-ui/core";
import { Box, Typography } from "components/material-ui";
import { capitalizeFirstLetter } from "utils/common";

export const Info = (props) => {
  const { match, playerColor } = props;
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={3}>
        {match.tournament ? `Round ${match.tournament.round + 1}: ` : ""}
        {match.settings
          ? `${match.settings.startTime} + ${
              match.settings.increment
            } ${capitalizeFirstLetter(match.settings.timeCategory)}`
          : ""}
      </Typography>
      <Box
        display="flex"
        flexDirection={playerColor ? "column-reverse" : "column"}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box
            borderRadius="100%"
            width={16}
            height={16}
            bgcolor={theme.palette.common.black}
            mr={5}
          />
          <Typography>
            {match.players[1].name}({match.players[1].rating})
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box
            borderRadius="100%"
            width={16}
            height={16}
            bgcolor={theme.palette.common.white}
            mr={5}
          />
          <Typography>
            {match.players[0].name}({match.players[0].rating})
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
