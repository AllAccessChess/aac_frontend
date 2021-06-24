import React from "react";

import { TableCell, Typography } from "components/material-ui";

export const CellItem = (props) => {
  const { cell, rowIndex } = props;
  if (cell.action === "number") return <TableCell> {rowIndex + 1} </TableCell>;
  if (cell.action === "move")
    return <TableCell> {cell.content.san} </TableCell>;
  return <Typography>{cell.content}</Typography>;
};
