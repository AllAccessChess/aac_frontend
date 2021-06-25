import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { useTheme } from "@material-ui/core";
import { Box, Typography, Link } from "components/material-ui";

import { getLiveGameIDs } from "redux/reducers/matchReducer";

export const Admin = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const liveGameIDs = useSelector((state) => state.matchReducer.liveIDs);

  useEffect(() => {
    if (!liveGameIDs.length) {
      dispatch(getLiveGameIDs());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      m={4}
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="h3" mb={2}>
        Admin Panel
      </Typography>
      <Box display="flex" flexDirection="column">
        {liveGameIDs.map((gameID) => (
          <Link key={gameID} component={RouterLink} to={`/spectate/${gameID}`}>
            {gameID}
          </Link>
        ))}
      </Box>
    </Box>
  );
};
