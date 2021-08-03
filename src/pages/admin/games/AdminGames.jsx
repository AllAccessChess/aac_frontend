import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { useTheme } from "@material-ui/core";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
} from "components/material-ui";

import { getLiveGames } from "redux/reducers/matchReducer";
import { isAdmin } from "utils/common";

export const AdminGames = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const liveGames = useSelector((state) => state.matchReducer.liveGames);
  const user = useSelector((state) => state.authReducer.user);

  const handleCreateGame = useCallback(() => {
    history.push("/admin/games/new");
  }, [history]);

  useEffect(() => {
    dispatch(getLiveGames());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user && user.id && !isAdmin(user)) {
      history.push("/tournaments");
    }
  }, [user, history]);

  return (
    <Box
      width="100%"
      position="relative"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="h3" mb={2}>
        Live Games
      </Typography>
      <TableContainer>
        <Table stickyHeader aria-label="members table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="textSecondary">
                  Game ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">
                  Title
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {liveGames.map((game) => (
              <TableRow tabIndex={-1} key={game.id}>
                <TableCell>
                  <Typography variant="body1">{game.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{game.title}</Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Link component={RouterLink} to={`/spectate/${game.id}`}>
                      <Typography variant="body1">Spectate</Typography>
                    </Link>
                    {isAdmin(user) && (
                      <React.Fragment>
                        <Typography>&nbsp;|&nbsp;</Typography>
                        <Link
                          component={RouterLink}
                          to={`/spectate/${game.id}/td`}
                        >
                          <Typography variant="body1">
                            Join as Director
                          </Typography>
                        </Link>
                      </React.Fragment>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box position="absolute" right={20} top={15}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateGame}
        >
          Create Game
        </Button>
      </Box>
    </Box>
  );
};
