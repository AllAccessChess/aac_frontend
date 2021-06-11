import React, { useMemo } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Typography, Paper } from "components/common/SpacedMui";

const CellItem = (props) => {
  const { cell, rowIndex } = props;
  if (cell.action === "number") return <TableCell> {rowIndex + 1} </TableCell>;
  if (cell.action === "move")
    return <TableCell> {cell.content.san} </TableCell>;
  return <Typography>{cell.content}</Typography>;
};

const ActionHistory = (props) => {
  const { moveHistory, width, height } = props;
  const rows = useMemo(() => {
    let tempRows = [];
    let index = 0;
    let tempRow = [];
    for (let item of moveHistory) {
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
  }, [moveHistory]);

  return (
    <Box
      bgcolor="#134378"
      borderRadius={10}
      height={height}
      width={width}
      overflow="auto"
    >
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
  );
};

export default ActionHistory;
