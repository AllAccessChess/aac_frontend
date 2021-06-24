import React from "react";
import moment from "moment";

import { useSelector } from "react-redux";
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
export const TournamentCard = (props) => {
  const { tournament, onViewDetails, onRegister, onFindMatch } = props;
  const { user } = useSelector(authSelector);

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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <CustomIcon icon={faGamepad} />
              <Typography variant="body1" color="textSecondary">
                {tournament.settings.variant}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
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
              {moment(tournament.startAt).format("MMMM Do YYYY @ h:mm a")} -{" "}
              {moment(tournament.endAt).format("h:mm a")}
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
        {onRegister && user && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onRegister(tournament)}
          >
            Register Now
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
      </Box>
    </Box>
  );
};
