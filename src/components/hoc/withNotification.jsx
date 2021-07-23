import React, { useEffect, useCallback } from "react";
import useInterval from "react-useinterval";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Typography } from "components/material-ui";

import { getMyNotifications } from "redux/reducers/notificationReducer";
import { useHistory } from "react-router";

const Notification = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state.notificationReducer.list
  );

  const navigateToGame = useCallback(
    (gameID) => {
      history.push(`/match/${gameID}`);
    },
    [history]
  );

  useInterval(() => {
    dispatch(getMyNotifications());
  }, [10000]);

  useEffect(() => {
    dispatch(getMyNotifications());
    // eslint-disable-next-line
  }, []);

  if (!notificationList.length) return <></>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="#F7B500"
      px="5%"
      py="10px"
    >
      {notificationList.map((notification, index) => (
        <Box key={index} mb={index ? 2 : 0}>
          {notification.game ? (
            <Typography>
              You are currently in the game called "{notification.game.title}"{" "}
              <Button
                ml={2}
                size="small"
                variant="outlined"
                onClick={() => navigateToGame(notification.game.id)}
              >
                Enter Game
              </Button>
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      ))}
    </Box>
  );
};

export const withNotification = (Component) => (props) => {
  return (
    <React.Fragment>
      <Notification />
      <Component {...props} />
    </React.Fragment>
  );
};
