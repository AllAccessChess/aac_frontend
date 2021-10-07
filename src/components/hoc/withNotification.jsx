import React, { useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import useInterval from "react-useinterval";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Typography } from "components/material-ui";

import { getMyNotifications } from "redux/reducers/notificationReducer";
import { useHistory } from "react-router";

const CustomButton = styled(Button)`
  border-width: 2px !important;
`;

const Notification = (props) => {
  const { hideTournamentLevel = false } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state.notificationReducer.list
  );
  const user = useSelector((state) => state.authReducer.user);
  const filteredNotifications = useMemo(
    () =>
      notificationList.filter(
        (item) => !hideTournamentLevel || !item.tournament
      ),
    [notificationList, hideTournamentLevel]
  );

  const navigateToGame = useCallback(
    (gameID) => {
      history.push(`/match/${gameID}`);
    },
    [history]
  );

  const navigateToTournament = useCallback(
    (tournamentID) => {
      history.push(`/tournament/${tournamentID}`);
    },
    [history]
  );

  useInterval(
    () => {
      if (user) {
        dispatch(getMyNotifications());
      }
    },
    user ? 10000 : null
  );

  useEffect(() => {
    if (user) {
      dispatch(getMyNotifications());
    }
    // eslint-disable-next-line
  }, []);

  if (!filteredNotifications.length) return <></>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="#F7B500"
      px="30px"
      py="10px"
      mb={5}
      borderRadius={5}
    >
      {filteredNotifications.map((notification, index) => (
        <Box key={index} mt={index ? 2 : 0}>
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
          ) : notification.tournament ? (
            <Typography color="primary">
              You are currently in the tournament called "
              {notification.tournament.title}"{" "}
              <CustomButton
                ml={2}
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigateToTournament(notification.tournament.id)}
              >
                Enter Tournament
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

export const withNotification = (Component, NotificationProps) => (props) => {
  return (
    <React.Fragment>
      <Notification {...NotificationProps} />
      <Component {...props} />
    </React.Fragment>
  );
};
