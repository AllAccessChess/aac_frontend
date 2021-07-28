import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import useInterval from "react-useinterval";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Typography } from "components/material-ui";

import { getMyNotifications } from "redux/reducers/notificationReducer";
import { useHistory } from "react-router";

const CustomButton = styled(Button)`
  border-width: 2px !important;
`;

const Notification = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state.notificationReducer.list
  );
  const user = useSelector((state) => state.authReducer.user);

  const navigateToGame = useCallback(
    (gameID) => {
      history.push(`/match/${gameID}`);
    },
    [history]
  );

  useInterval(() => {
    if (user) {
      dispatch(getMyNotifications());
    }
  }, [user ? 10000 : null]);

  useEffect(() => {
    if (user) {
      dispatch(getMyNotifications());
    }
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
            <Typography color="primary">
              You are currently in the game called "{notification.game.title}"{" "}
              <CustomButton
                ml={2}
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigateToGame(notification.game.id)}
              >
                Enter Game
              </CustomButton>
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
