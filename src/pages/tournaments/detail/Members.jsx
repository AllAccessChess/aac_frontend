import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";

import { SortableTableHead, TabPanel } from "components/common";
import {
  Box,
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
import { stableSort, tableComparator } from "utils/common";

const CustomPaper = styled(Paper)`
  width: 100%;
`;

const Members = (props) => {
  const { members } = props;
  const tabs = useMemo(
    () => ["Open", "Under 2200", "Under 1800", "Under 1400"],
    []
  );
  const sortableCells = useMemo(
    () => [
      {
        id: "name",
        label: "Name",
      },
      {
        id: "rating",
        label: "Online Blitz rating",
      },
      {
        id: "byes",
        label: "Byes",
      },
    ],
    []
  );
  const [tabValue, setTabValue] = useState(0);
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
  const memberFilter = (item, tabValue) => {
    if (tabValue === 1 && item.ratings.uscf.ratings.blitz.rating >= 2200)
      return false;
    if (tabValue === 2 && item.ratings.uscf.ratings.blitz.rating >= 1800)
      return false;
    if (tabValue === 3 && item.ratings.uscf.ratings.blitz.rating >= 1400)
      return false;
    return true;
  };
  const getFilterMembers = useCallback(
    (tabValue) => {
      return members
        .filter((item) => memberFilter(item, tabValue))
        .map((item) => ({
          name: item.name,
          rating: item.ratings.uscf.ratings.blitz.rating,
          byes: "-",
        }));
    },
    [members]
  );
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!members.length) return <></>;
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
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="members">
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
        {tabs.map((tab, tabIndex) => {
          const filteredMembers = getFilterMembers(tabValue);
          return (
            <TabPanel key={tab} value={tabValue} index={tabIndex}>
              <TableContainer>
                <Table stickyHeader aria-label="members table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" color="textSecondary">
                          S.No
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
                    {stableSort(
                      filteredMembers,
                      tableComparator(order, orderBy)
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((member, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>
                            <Typography variant="body1">
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {member.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {member.rating}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">-</Typography>
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
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TabPanel>
          );
        })}
      </Box>
    </CustomPaper>
  );
};

export default Members;
