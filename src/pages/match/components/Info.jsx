import React from "react";
import { Box, useTheme } from "@material-ui/core";

import { Typography } from "components/common/SpacedMui";

export const Info = (props) => {
  const { match } = props;
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={3}>
        Round 1
      </Typography>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          borderRadius="100%"
          width={16}
          height={16}
          bgcolor={theme.palette.common.black}
          mr={5}
        />
        <Typography>{match.players[0].name}(1200)</Typography>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box
          borderRadius="100%"
          width={16}
          height={16}
          bgcolor={theme.palette.common.white}
          mr={5}
        />
        <Typography>{match.players[1].name}(1400)</Typography>
      </Box>
    </Box>
  );
};
