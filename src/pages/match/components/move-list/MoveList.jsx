import React, { useMemo } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper,
} from "components/material-ui";
import { CellItem, EndActions } from "./components";

export const MoveList = (props) => {
  const {
    playerColor,
    moveList,
    askingDraw,
    onOfferDraw,
    onResign,
    onAcceptDraw,
    onDeclineDraw,
  } = props;
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
      <TableContainer component={Paper} style={{ height: `calc(100% - 70px)` }}>
        <Table stickyHeader>
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
      <Box my={3}>
        <Divider />
      </Box>
      <EndActions
        playerColor={playerColor}
        askingDraw={askingDraw}
        onOfferDraw={onOfferDraw}
        onResign={onResign}
        onAcceptDraw={onAcceptDraw}
        onDeclineDraw={onDeclineDraw}
      />
    </Box>
  );
};
