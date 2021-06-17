import React from "react";

import { Box, Dialog, DialogTitle, DialogContent } from "@material-ui/core";

import queen from "assets/images/wQ.svg";
import rook from "assets/images/wR.svg";
import bishop from "assets/images/wB.svg";
import knight from "assets/images/wN.svg";

const TransformPawnDialog = (props) => {
  const { open, onSubmit } = props;

  return (
    <Dialog open={open} aria-labelledby="pawn-transform">
      <DialogTitle id="pawn-transform">Transform Your Pawn</DialogTitle>
      <DialogContent dividers id="pawn-transform-content">
        <Box style={{ textAlign: "center", cursor: "pointer" }}>
          <span role="presentation" onClick={() => onSubmit("q")}>
            <img src={queen} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => onSubmit("r")}>
            <img src={rook} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => onSubmit("b")}>
            <img src={bishop} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => onSubmit("n")}>
            <img src={knight} alt="" style={{ width: 50 }} />
          </span>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TransformPawnDialog;
