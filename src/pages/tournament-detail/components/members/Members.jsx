import React, { useState, useMemo } from "react";

import { SortableTableHead } from "components/common";
import {
  Box,
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
import { CustomPaper, ByeCell, NumberCell } from "./styles";

import { stableSort, tableComparator } from "utils/common";

export const Members = (props) => {
  const { user, tournament } = props;
  const [tabValue, setTabValue] = useState(0);
  const tabs = useMemo(
    () =>
      tournament.brackets.map((bracket) =>
        bracket.upper
          ? `${bracket.lower} - ${bracket.upper}`
          : `Over ${bracket.lower}`
      ),
    [tournament]
  );
  const sortableCells = useMemo(
    () => [
      {
        id: "name",
        label: "Name",
      },
      {
        id: "rating",
        label: "Online Blitz Rating",
      },
      {
        id: "byes",
        label: "Bye Rounds",
      },
    ],
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("rating");

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

  const filteredMembers = useMemo(
    () =>
      tournament.brackets[tabValue].players.map((item) => ({
        id: item.id,
        name: item.name,
        rating: item.rating || 0,
        byes: tournament.brackets[tabValue].rounds.map((round) =>
          round.byes.includes(item.id)
        ),
      })),
    [tournament, tabValue]
  );
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!tournament.brackets.length) return <></>;
  return (
    <CustomPaper round="true" mb={5}>
      <Box p={3}>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4">Members Playing</Typography>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="members"
          mb={3}
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>

        <TableContainer>
          <Table stickyHeader aria-label="members table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    Seed
                  </Typography>
                </TableCell>
                {sortableCells.map((cell) => (
                  <SortableTableHead
                    key={cell.id}
                    order={order}
                    orderBy={orderBy}
                    headCell={cell}
                    onRequestSort={handleRequestSort}
                  />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredMembers, tableComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member, index) => (
                  <TableRow tabIndex={-1} key={index}>
                    <TableCell>
                      <Box display="flex">
                        <NumberCell
                          variant="body1"
                          state={user && member.id === user.id ? "owner" : ""}
                        >
                          {page * rowsPerPage + index + 1}
                        </NumberCell>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{member.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{member.rating}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {member.byes.map((bye, index) => (
                          <ByeCell
                            key={index}
                            variant="body2"
                            state={
                              user && member.id === user.id && bye
                                ? "owneractive"
                                : bye
                                ? "active"
                                : ""
                            }
                          >
                            {index + 1}
                          </ByeCell>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </CustomPaper>
  );
};
