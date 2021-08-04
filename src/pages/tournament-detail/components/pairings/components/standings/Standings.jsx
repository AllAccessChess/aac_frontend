import React, { useMemo, useState } from "react";
import { useTheme } from "@material-ui/styles";

import { SortableTableHead } from "components/common";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "components/material-ui";
import { getPlayerScores, stableSort, tableComparator } from "utils/common";

export const Standings = (props) => {
  const { tournament, currentBracket } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("rating");
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const players = useMemo(
    () =>
      currentBracket.players.map((player) => ({
        ...player,
        ...getPlayerScores(
          currentBracket,
          tournament.settings.numRounds,
          player
        ).reduce(
          (scores, score, index) => ({
            ...scores,
            [`round${index + 1}`]: score,
          }),
          {}
        ),
      })),
    [tournament, currentBracket]
  );

  const rounds = useMemo(
    () =>
      Array.from(Array(tournament.settings.numRounds).keys()).map(
        (key) => key + 1
      ),
    [tournament]
  );

  const scoreColor = {
    0: theme.palette.error.main,
    "1/2": theme.palette.secondary.main,
    1: theme.palette.text.primary,
    2: theme.palette.success.main,
    "-": theme.palette.text.primary,
  };
  return (
    <React.Fragment>
      <TableContainer>
        <Table stickyHeader aria-label="Standings table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="textSecondary">
                  B.No.
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">
                  Name
                </Typography>
              </TableCell>
              <SortableTableHead
                align="center"
                order={order}
                orderBy={orderBy}
                headCell={{
                  id: "rating",
                  label: "Rating",
                }}
                onRequestSort={handleRequestSort}
              />
              {rounds.map((round) => (
                <SortableTableHead
                  key={`score-round-${round}`}
                  align="center"
                  order={order}
                  orderBy={orderBy}
                  headCell={{
                    id: `round${round}`,
                    label: `Round ${round}`,
                  }}
                  onRequestSort={handleRequestSort}
                />
              ))}
              <SortableTableHead
                align="center"
                width={300}
                order={order}
                orderBy={orderBy}
                headCell={{
                  id: "score",
                  label: "Score",
                }}
                onRequestSort={handleRequestSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(players, tableComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((player, index) => {
                return (
                  <TableRow tabIndex={-1} key={index}>
                    <TableCell>
                      <Typography variant="body1">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {player.name || ""}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {player.rating || 0}
                      </Typography>
                    </TableCell>
                    {rounds.map((round) => (
                      <TableCell
                        key={`${player.id}-score-round-${round}`}
                        align="center"
                      >
                        <Typography
                          variant="body1"
                          style={{
                            color: scoreColor[player[`round${round}`]],
                          }}
                        >
                          {player[`round${round}`]}
                        </Typography>
                      </TableCell>
                    ))}
                    <TableCell width={300} align="center">
                      <Typography variant="body1">
                        {player.score || 0}
                      </Typography>
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
        count={currentBracket.players.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};
