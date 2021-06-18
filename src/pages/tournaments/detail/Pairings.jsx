import React, { useState } from "react";
import styled from "styled-components";

import {
  Box,
  MenuItem,
  Paper,
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
import { InlineFilledSelect, TabPanel } from "components/common";

const CustomPaper = styled(Paper)`
  width: 100%;
`;

const Pairings = (props) => {
  const { tournament } = props;
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [matchFilter, setMatchFilter] = useState(1200);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectChange = (event) => {
    setMatchFilter(event.target.value);
  };

  if (!tournament.rounds.length) return <></>;
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
            value={matchFilter}
            onChange={handleSelectChange}
          >
            <MenuItem value={1200}>&#10094;1200</MenuItem>
            <MenuItem value={2400}>&#10094;2400</MenuItem>
            <MenuItem value={3600}>&#10094;3600</MenuItem>
          </InlineFilledSelect>
        </Box>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="rounds">
          {tournament.rounds.map((round, index) => (
            <Tab key={index} label={`Round ${index + 1}`} />
          ))}
        </Tabs>
        {tournament.rounds.map((round, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
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
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        Winner
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        Result
                      </Typography>
                    </TableCell>
                    <TableCell>
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
                      const whitePlayer = tournament.players.find(
                        (player) => player.id === match.playerIds[0]
                      );
                      const blackPlayer = tournament.players.find(
                        (player) => player.id === match.playerIds[1]
                      );

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
                          <TableCell>{match.result}</TableCell>
                          <TableCell>
                            {/* <Link
                              component={RouterLink}
                              color="primary"
                              to={`/match/${match.id}`}
                            >
                              <Typography variant="body1">
                                {isMatchOwner(match, user)
                                  ? "Play Now"
                                  : "Watch Live"}
                              </Typography>
                            </Link> */}
                            {round.state === 1 ? "Finished" : "In Progress"}
                          </TableCell>
                          <TableCell>-</TableCell>
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
      </Box>
    </CustomPaper>
  );
};

export default Pairings;
