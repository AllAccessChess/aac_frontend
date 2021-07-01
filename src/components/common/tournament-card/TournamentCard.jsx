import React, { useState } from "react";
import moment from "moment";

import { useSelector } from "react-redux";
import useInterval from "react-useinterval";
import { Box, Button, Typography } from "components/material-ui";
import { CustomIcon } from "./styles";

import Bishop from "assets/images/bishop.svg";
import {
  faGamepad,
  faClock,
  faPoll,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

import { authSelector } from "redux/reducers";
import { getRemainingTimeString } from "utils/common";

export const TournamentCard = (props) => {
  const {
    tournament,
    onViewDetails,
    onRegister,
    onUnRegister,
    onFindMatch,
  } = props;
  const { user } = useSelector(authSelector);
  const offsetInMileSeconds = 300000;
  const [remainTimeForTournament, setRemainTimeForTournament] = useState(
    tournament.start
      ? tournament.start - new Date().getTime() - offsetInMileSeconds
      : 0
  );

  useInterval(
    () => {
      setRemainTimeForTournament(
        tournament.start
          ? tournament.start - new Date().getTime() - offsetInMileSeconds
          : 0
      );
    },
    tournament.start &&
      tournament.start - offsetInMileSeconds > new Date().getTime()
      ? 1000
      : null
  );

  return (
    <Box
      width="100%"
      display="flex"
      bgcolor="#15375C"
      justifyContent="space-between"
    >
      <Box display="flex">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#134378"
          width="140px"
          height="140px"
          borderRadius={5}
        >
          <img src={Bishop} alt="Bishop" />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          px={5}
          py={4}
          justifyContent="space-between"
        >
          <Typography variant="h4">{tournament.title}</Typography>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center" mr={4}>
              <CustomIcon icon={faGamepad} />
              <Typography variant="body1" color="textSecondary">
                {tournament.settings.variant}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mr={4}>
              <CustomIcon icon={faClock} />
              <Typography variant="body1" color="textSecondary">
                {tournament.settings.startTime || 30} +{" "}
                {tournament.settings.increment || 0}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CustomIcon icon={faPoll} />
              <Typography variant="body1" color="textSecondary">
                ${tournament.prize || 300}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <CustomIcon icon={faCalendarAlt} />
            <Typography variant="body1" color="textSecondary">
              {tournament.start
                ? moment(new Date(tournament.start)).format(
                    "MMMM Do YYYY @ h:mm a"
                  )
                : "-"}
              {tournament.end
                ? " - " + moment(new Date(tournament.end)).format("h:mm a")
                : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-end"
        width="20%"
      >
        <Typography variant="body2" color="textSecondary">
          Organized by{" "}
          <Typography variant="body1" component="span" color="textPrimary">
            {tournament.organizedBy || "USCF"}
          </Typography>
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          {onViewDetails && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onViewDetails(tournament)}
            >
              View Details
            </Button>
          )}
          {onRegister && user && remainTimeForTournament > 0 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onRegister()}
            >
              Register Now
            </Button>
          )}
          {onUnRegister && user && remainTimeForTournament > 0 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onUnRegister()}
            >
              UnRegister
            </Button>
          )}
          {onFindMatch && user && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onFindMatch()}
            >
              Find Match
            </Button>
          )}
          {tournament.start && remainTimeForTournament > 0 ? (
            <Typography variant="body2" color="textSecondary" mt={2}>
              Closing in {getRemainingTimeString(remainTimeForTournament)}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  );
};
