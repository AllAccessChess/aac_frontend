import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Box, Button, Typography, Grid } from "components/material-ui";
import { Flag as FlagIcon } from "@material-ui/icons";
import { showSuccess } from "redux/reducers/messageReducer";

export const EndActions = (props) => {
  const dispatch = useDispatch();
  const {
    playerColor,
    askingDraw,
    onOfferDraw,
    onResign,
    onAcceptDraw,
    onDeclineDraw,
  } = props;

  const [confirmingDraw, setConfirmingDraw] = useState(false);
  const [confirmingResign, setConfirmingResign] = useState(false);

  const handleOfferDraw = () => {
    onOfferDraw();
    setConfirmingDraw(false);
    dispatch(showSuccess("Just Offered a Draw!"));
  };

  const handleResign = () => {
    onResign();
    setConfirmingResign(false);
  };

  if (askingDraw) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Typography variant="body2" mb={2}>
          {playerColor === 0 ? "Black" : "White"} has offered a draw
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              onClick={onAcceptDraw}
            >
              Accept Draw
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onDeclineDraw}
            >
              Decline Draw
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (confirmingResign) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Typography variant="body2" mb={2}>
          Are you sure you want to resign?
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              startIcon={<FlagIcon />}
              onClick={handleResign}
            >
              Resign
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => setConfirmingResign(false)}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (confirmingDraw) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Typography variant="body2" mb={2}>
          Are you sure you want to offer draw?
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              onClick={handleOfferDraw}
            >
              Offer Draw
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => setConfirmingDraw(false)}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={() => setConfirmingDraw(true)}
          >
            Offer Draw
          </Button>
        </Grid>
        <Grid item md={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<FlagIcon />}
            onClick={() => setConfirmingResign(true)}
          >
            Resign
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
