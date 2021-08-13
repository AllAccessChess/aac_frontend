import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileDownload,
  faPencilAlt,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

import { InlineFilledSelect, Spinner, TabPanel } from "components/common";
import {
  Box,
  Button,
  IconButton,
  Link,
  MenuItem,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "components/material-ui";
import { GameResults, RoundStatus, TournamentStatus } from "constant";
import { getRoundStateString, isAdmin } from "utils/common";
import { Standings } from "./components";
import { CustomPaper } from "./styles";

export const Pairings = (props) => {
  const {
    tournament,
    currentBracketIndex,
    setCurrentBracketIndex,
    currentRoundIndex,
    onManagePairings,
    onDownloadPGN,
    onUpdateMatchResult,
  } = props;
  const user = useSelector((state) => state.authReducer.user);
  const [tabValue, setTabValue] = useState(
    currentRoundIndex >= 0 ? currentRoundIndex : 0
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingGameId, setEditingGameId] = useState(null);
  const [editedResult, setEditedResult] = useState();
  const [updatingResult, setUpdatingResult] = useState(false);

  const currentBracket = useMemo(
    () => tournament.brackets[currentBracketIndex],
    [tournament, currentBracketIndex]
  );

  useEffect(() => {
    if (currentRoundIndex >= 0) setTabValue(currentRoundIndex);
  }, [currentRoundIndex]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectChange = (event) => {
    setCurrentBracketIndex(event.target.value);
  };

  const handleClickEditGame = (match) => {
    setEditingGameId(match.gameId);
    setEditedResult(match.result);
  };

  const handleSelectResult = (event) => {
    setEditedResult(event.target.value);
  };

  const handleClickSaveGameResult = () => {
    setUpdatingResult(true);
    onUpdateMatchResult(
      tournament,
      currentBracketIndex,
      tabValue,
      {
        game: editingGameId,
        result: editedResult,
      },
      () => {
        setUpdatingResult(false);
        setEditingGameId(null);
        setEditedResult(null);
      }
    );
  };

  if (!currentBracket.rounds.length) return <></>;
  return (
    <CustomPaper round="true" mb={5}>
      <Box p={3}>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4">Match Pairings</Typography>
          <InlineFilledSelect
            labelId="round-filter-label"
            label="Filter by"
            id="round-filter"
            value={currentBracketIndex}
            onChange={handleSelectChange}
          >
            {tournament.brackets.map((bracket, index) => (
              <MenuItem value={index} key={index}>
                {bracket.upper
                  ? `${bracket.lower} - ${bracket.upper}`
                  : `>= ${bracket.lower}`}
              </MenuItem>
            ))}
          </InlineFilledSelect>
        </Box>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="rounds">
          {currentBracket.rounds.map((round, index) => (
            <Tab key={index} label={`Round ${index + 1}`} />
          ))}
          <Tab key={currentBracket.rounds.length} label="Standings" />
        </Tabs>
        {currentBracket.rounds.map((round, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            {isAdmin(user) &&
              tournament.state === TournamentStatus.ONGOING &&
              round.state === RoundStatus.SETUP && (
                <Box my={5} display="flex" justifyContent="flex-end">
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => onManagePairings(currentBracketIndex, index)}
                  >
                    Manage Pairings
                  </Button>
                </Box>
              )}
            <TableContainer>
              <Table stickyHeader aria-label="members table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        B.No.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        White
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        Black
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" color="textSecondary">
                        Result
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" color="textSecondary">
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" color="textSecondary">
                        PGN
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {round.boards
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((match, index) => {
                      const whitePlayer = currentBracket.players.find(
                        (player) => player.id === match.playerIds[0]
                      );
                      const blackPlayer = currentBracket.players.find(
                        (player) => player.id === match.playerIds[1]
                      );
                      const isOwner =
                        user &&
                        whitePlayer &&
                        blackPlayer &&
                        (whitePlayer.id === user.id ||
                          blackPlayer.id === user.id);

                      return (
                        <TableRow tabIndex={-1} key={index}>
                          <TableCell>
                            <Typography variant="body1">
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {whitePlayer ? whitePlayer.name : ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {blackPlayer ? blackPlayer.name : ""}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              {editingGameId === match.gameId &&
                              !updatingResult ? (
                                <React.Fragment>
                                  <Select
                                    value={editedResult}
                                    onChange={handleSelectResult}
                                  >
                                    <MenuItem value={"1-0"}>1-0</MenuItem>
                                    <MenuItem value={"1/2-1/2"}>
                                      1/2-1/2
                                    </MenuItem>
                                    <MenuItem value={"0-1"}>0-1</MenuItem>
                                  </Select>
                                  <Box ml={3}>
                                    <IconButton
                                      onClick={handleClickSaveGameResult}
                                    >
                                      <FontAwesomeIcon
                                        icon={faSave}
                                        size="sm"
                                      />
                                    </IconButton>
                                  </Box>
                                </React.Fragment>
                              ) : editingGameId === match.gameId &&
                                updatingResult ? (
                                <Spinner size={20} />
                              ) : (
                                <React.Fragment>
                                  <Typography variant="body1">
                                    {match.result}
                                  </Typography>
                                  {isAdmin(user) &&
                                    round.state === RoundStatus.FINISHED && (
                                      <Box ml={3}>
                                        <IconButton
                                          onClick={() =>
                                            handleClickEditGame(match)
                                          }
                                        >
                                          <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            size="sm"
                                          />
                                        </IconButton>
                                      </Box>
                                    )}
                                </React.Fragment>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {round.state === RoundStatus.PLAYING &&
                            match.result === GameResults.ONGOING ? (
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {!match.gameId || !user ? (
                                  <Typography variant="body1">
                                    Playing
                                  </Typography>
                                ) : (
                                  <React.Fragment>
                                    <Link
                                      component={RouterLink}
                                      color="primary"
                                      to={
                                        isOwner
                                          ? `/match/${match.gameId}`
                                          : `/spectate/${match.gameId}`
                                      }
                                    >
                                      <Typography variant="body1">
                                        {getRoundStateString(
                                          round.state,
                                          match.result,
                                          isOwner
                                        )}
                                      </Typography>
                                    </Link>
                                    {isAdmin(user) && !isOwner && (
                                      <Box display="flex">
                                        <Typography>&nbsp;|&nbsp;</Typography>
                                        <Link
                                          component={RouterLink}
                                          color="primary"
                                          to={`/spectate/${match.gameId}/td`}
                                        >
                                          <Typography variant="body1">
                                            Join as Director
                                          </Typography>
                                        </Link>
                                      </Box>
                                    )}
                                  </React.Fragment>
                                )}
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Typography variant="body1">
                                  {getRoundStateString(
                                    round.state,
                                    match.result
                                  )}
                                </Typography>
                                <Typography>&nbsp;|&nbsp;</Typography>
                                <Link
                                  component={RouterLink}
                                  color="primary"
                                  to={`/analysis/${match.gameId}`}
                                >
                                  <Typography variant="body1">
                                    Analyze
                                  </Typography>
                                </Link>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {match.result !== GameResults.ONGOING ? (
                              <IconButton
                                onClick={() =>
                                  onDownloadPGN(
                                    match.gameId,
                                    `${tournament.title}: Round ${index + 1}(${
                                      whitePlayer.name
                                    } vs ${blackPlayer.name})`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faFileDownload} />
                              </IconButton>
                            ) : (
                              <Typography variant="body1">-</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 30]}
              component="div"
              count={round.boards.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TabPanel>
        ))}
        <TabPanel
          key={currentBracket.rounds.length}
          value={tabValue}
          index={currentBracket.rounds.length}
        >
          <Standings tournament={tournament} currentBracket={currentBracket} />
        </TabPanel>
      </Box>
    </CustomPaper>
  );
};
