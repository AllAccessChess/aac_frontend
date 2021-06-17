import React, { useMemo } from "react";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Typography,
  Paper,
} from "components/material-ui";

const CellItem = (props) => {
  const { cell, rowIndex } = props;
  if (cell.action === "number") return <TableCell> {rowIndex + 1} </TableCell>;
  if (cell.action === "move")
    return <TableCell> {cell.content.san} </TableCell>;
  return <Typography>{cell.content}</Typography>;
};

export const MoveList = (props) => {
  const { moveList } = props;
  const rows = useMemo(() => {
    let tempRows = [];
    let index = 0;
    let tempRow = [];
    for (let item of moveList) {
      if (item.action === "move") {
        if (index === 0) {
          tempRow.push({ action: "number" });
          index++;
        }
        tempRow.push(item);
        index++;
        if (index === 3) {
          tempRows.push(tempRow);
          tempRow = [];
          index = 0;
        }
      } else {
        tempRows.push([item]);
      }
    }
    if (tempRow.length) tempRows.push(tempRow);
    return tempRows;
  }, [moveList]);

  return (
    <Box
      bgcolor="#134378"
      borderRadius={10}
      height="100%"
      display="flex"
      flexDirection="column"
      py={3}
    >
      <Box flexGrow={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>White</TableCell>
                <TableCell>Black</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <CellItem cell={cell} rowIndex={index} key={cellIndex} />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box my={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" color="primary" size="large">
          Offer Draw
        </Button>
        <Button variant="contained" color="primary" size="large">
          Resign
        </Button>
      </Box>
    </Box>
  );
};