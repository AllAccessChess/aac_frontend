import React from "react";

import { TableCell, TableSortLabel, Typography } from "components/material-ui";

export const SortableTableHead = (props) => {
  const { order, orderBy, headCell, onRequestSort, ...tableCellProps } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableCell
      sortDirection={orderBy === headCell.id ? order : false}
      {...tableCellProps}
    >
      <TableSortLabel
        active={orderBy === headCell.id}
        direction={orderBy === headCell.id ? order : "asc"}
        onClick={createSortHandler(headCell.id)}
      >
        <Typography variant="body1" color="textSecondary">
          {headCell.label}
        </Typography>
      </TableSortLabel>
    </TableCell>
  );
};
