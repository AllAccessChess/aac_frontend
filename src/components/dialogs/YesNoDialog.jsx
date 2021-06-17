import React from "react";
import styled from "styled-components";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "components/material-ui";

const TextWrapper = styled(Box)`
  font-size: 1rem;
`;

const YesNoDialog = (props) => {
  const { text, open, onYes, onNo } = props;

  return (
    <Dialog aria-labelledby="confirm-title" open={open}>
      <DialogTitle id="confirm-title">Confirm</DialogTitle>
      <DialogContent dividers>
        <TextWrapper>{text}</TextWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onYes} color="secondary" variant="outlined" autoFocus>
          Yes
        </Button>
        <Button onClick={onNo} color="primary" variant="outlined">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YesNoDialog;
