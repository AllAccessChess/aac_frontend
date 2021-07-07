import React from "react";
import { useSelector } from "react-redux";

import { Avatar, Box, Typography } from "components/material-ui";
import { useStyles } from "./styles";

export const ChatItem = (props) => {
  const { participants, message } = props;
  const currentUser = useSelector((state) => state.authReducer.user);
  const classes = useStyles();

  const participant = participants.find((p) => p.id === message.sender);
  const self = currentUser && currentUser.id === message.sender;

  return (
    <Box
      display="flex"
      width="100%"
      justifyContent={self ? "flex-end" : "flex-start"}
      my={3}
    >
      {self ? (
        <Typography variant="body1" className={classes.message}>
          {message.message}
        </Typography>
      ) : (
        <React.Fragment>
          <Avatar className={classes.avatar}>
            {(participant.name || message.sender)[0]}
          </Avatar>
          <Box display="flex" flexDirection="column">
            <Typography variant="body2" className={classes.username}>
              {participant.name || message.sender}
            </Typography>
            <Typography variant="body1" className={classes.message}>
              {message.message}
            </Typography>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
