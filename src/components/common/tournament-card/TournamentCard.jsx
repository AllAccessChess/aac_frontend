import React, { useState, useMemo } from "react";
import moment from "moment";

import useInterval from "react-useinterval";
import { Button, Box, Typography } from "components/material-ui";
import { CustomIcon } from "./styles";

import regularIcon from "assets/icons/regular.png";
import blitzIcon from "assets/icons/blitz.png";
import quickIcon from "assets/icons/quick.png";
import {
  faGamepad,
  faClock,
  faDollarSign,
  faCalendarAlt,
  faHouseUser,
} from "@fortawesome/free-solid-svg-icons";

import { getRemainingTimeString, capitalizeFirstLetter } from "utils/common";
import { RoundStatus } from "constant";
import { GreenButton } from "components/common";

export const TournamentCard = (props) => {
  const {
    tournament,
    currentRoundIndex,
    onViewDetails,
    onRegister,
    onUnRegister,
    // onFindMatch,
    onJoinLobby,
    onStartRound,
    onEdit,
    onTogglePublish,
  } = props;
  const offsetInMileSeconds = 300000;

  const [remainTimeForTournament, setRemainTimeForTournament] = useState(
    tournament.start ? tournament.start - new Date().getTime() : 0
  );
  const [remainTimeForRound, setRemainTimeForRound] = useState(-1);

  const currentRound = useMemo(
    () =>
      tournament && currentRoundIndex >= 0
        ? tournament.rounds[currentRoundIndex]
        : null,
    [tournament, currentRoundIndex]
  );
  const tournamentTimerCondition =
    tournament.start && tournament.start > new Date().getTime();
  const roundTimerCondition =
    currentRound &&
    currentRound.state === RoundStatus.PLAYING &&
    currentRound.start > 0 &&
    currentRound.start > new Date().getTime();

  useInterval(
    () => {
      if (tournamentTimerCondition)
        setRemainTimeForTournament(tournament.start - new Date().getTime());
    },
    tournamentTimerCondition ? 1000 : null
  );

  useInterval(() => {
    if (roundTimerCondition)
      setRemainTimeForRound(currentRound.start - new Date().getTime());
  }, [roundTimerCondition ? 1000 : null]);

  return (
    <Box
      width="100%"
      display="flex"
      bgcolor="#15375C"
      justifyContent="space-between"
      alignItems="center"
      minHeight="140px"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#134378"
        width="140px"
        borderRadius={5}
      >
        <img
          src={
            tournament.settings.timeCategory === "blitz"
              ? blitzIcon
              : tournament.settings.timeCategory === "quick"
              ? quickIcon
              : regularIcon
          }
          width="100%"
          alt={tournament.timeCategory}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        flexGrow="1"
        height="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          px={5}
          height="100%"
          justifyContent="space-between"
          alignSelf="center"
          flexGrow="1"
          maxWidth="800px"
        >
          <Typography variant="h4">{tournament.title}</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" mr={4}>
              <CustomIcon icon={faGamepad} />
              <Typography variant="body1" color="textSecondary">
                {tournament.rounds.length} Round{" "}
                {capitalizeFirstLetter(tournament.settings.type)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mr={4}>
              <CustomIcon icon={faClock} />
              <Typography variant="body1" color="textSecondary">
                G{tournament.settings.startTime || 30} +{" "}
                {tournament.settings.increment || 0}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CustomIcon icon={faDollarSign} />
              <Typography variant="body1" color="textSecondary">
                ${tournament.prize || 300}
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" mr={4}>
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
            <Box display="flex" alignItems="center">
              <CustomIcon icon={faHouseUser} />
              <Typography variant="body1" color="textSecondary">
                {tournament.organiser || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          height="100%"
          width="25%"
          maxWidth="200px"
        >
          {onEdit && (
            <Button
              variant="contained"
              color="secondary"
              mb={2}
              fullWidth
              onClick={() => onEdit(tournament.id)}
            >
              Edit Tournament
            </Button>
          )}
          {onTogglePublish && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              fullWidth
              onClick={() =>
                onTogglePublish(tournament.id, !tournament.published)
              }
            >
              {tournament.published ? "UnPublish" : "Publish"}
            </Button>
          )}
          {onViewDetails && tournament.start > new Date().getTime() && (
            <GreenButton
              variant="contained"
              color={"primary"}
              mb={2}
              fullWidth
              onClick={() => onViewDetails(tournament)}
            >
              Enter Lobby
            </GreenButton>
          )}
          {onViewDetails && tournament.start <= new Date().getTime() && (
            <Button
              variant="contained"
              color={"secondary"}
              mb={2}
              fullWidth
              onClick={() => onViewDetails(tournament)}
            >
              View Details
            </Button>
          )}
          {onRegister && remainTimeForTournament > 0 && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              fullWidth
              onClick={() => onRegister()}
            >
              Register Now
            </Button>
          )}
          {onUnRegister && remainTimeForTournament > 0 && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              fullWidth
              onClick={() => onUnRegister()}
            >
              Unregister
            </Button>
          )}
          {/* {onFindMatch && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              onClick={() => onFindMatch()}
            >
              Find Match
            </Button>
          )} */}
          {onStartRound && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              fullWidth
              onClick={() => onStartRound()}
            >
              Start Round
            </Button>
          )}

          {onJoinLobby && (
            <Button
              variant="contained"
              color="primary"
              mb={2}
              fullWidth
              onClick={() => onJoinLobby()}
            >
              Join Lobby
            </Button>
          )}
          {tournament.start &&
          remainTimeForTournament - offsetInMileSeconds > 0 ? (
            <Typography variant="body2" color="textSecondary">
              Closing in{" "}
              {getRemainingTimeString(
                remainTimeForTournament - offsetInMileSeconds
              )}
            </Typography>
          ) : currentRound && currentRound.state < RoundStatus.PLAYING ? (
            <Typography variant="body2" color="textSecondary">
              Waiting to start the round
            </Typography>
          ) : currentRound &&
            currentRound.state === RoundStatus.PLAYING &&
            remainTimeForRound > 0 ? (
            <Typography variant="body2" color="textSecondary">
              Round starts in {getRemainingTimeString(remainTimeForRound)}
            </Typography>
          ) : currentRound &&
            currentRound.state === RoundStatus.PLAYING &&
            currentRound.start <= new Date().getTime() ? (
            <Typography variant="body2" color="textSecondary">
              Round started
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  );
};
