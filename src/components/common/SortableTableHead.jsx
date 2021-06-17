import React from "react";
import { TableCell, TableSortLabel, Typography } from "@material-ui/core";

const SortableTableHead = (props) => {
  const { align, order, orderBy, headCell, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableCell
      align={align === "right" ? "right" : "left"}
      sortDirection={orderBy === headCell.id ? order : false}
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

export default SortableTableHead;
