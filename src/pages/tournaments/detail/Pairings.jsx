import React, { useState } from "react";
import styled from "styled-components";

import { Link as RouterLink } from "react-router-dom";
import { Link, Typography, Paper } from "components/common/SpacedMui";
import {
  Box,
  Tabs,
  Tab,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import InlineFilledSelect from "components/common/InlineFilledSelect";
import TabPanel from "components/common/TabPanel";

const CustomPaper = styled(Paper)`
  width: 100%;
`;

const Pairings = (props) => {
  const { rounds, user } = props;
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

  if (!rounds.length) return <></>;
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
          {rounds.map((round) => (
            <Tab key={round.id} label={`Round ${round.id + 1}`} />
          ))}
        </Tabs>
        {rounds.map((round) => (
          <TabPanel key={round.id} value={tabValue} index={round.id}>
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
                        Status
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
                  {round.matches
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((match, index) => (
                      <TableRow tabIndex={-1} key={index}>
                        <TableCell>
                          <Typography variant="body1">
                            {page * rowsPerPage + index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {match.white.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {match.black.name}
                          </Typography>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Link
                            component={RouterLink}
                            color="primary"
                            to={`/match/${match.id}`}
                          >
                            <Typography variant="body1">
                              {user &&
                              (user.username === match.white.username ||
                                user.username === match.black.username)
                                ? "Play Now"
                                : "Watch Live"}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 30]}
              component="div"
              count={round.matches.length}
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
