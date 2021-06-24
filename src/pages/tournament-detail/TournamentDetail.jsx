import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { ChevronLeft as BackIcon } from "@material-ui/icons";
import { Box, Button } from "components/material-ui";
import { LoadingScreen, TournamentCard } from "components/common";
import { Pairings, Members } from "./components";

import { TournamentStatus } from "constant";
import {
  getTournament,
  clearCurrent as clearCurrentTournament,
} from "redux/reducers/tournamentReducer";

export const TournamentDetail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );

  const handleBack = () => {
    dispatch(clearCurrentTournament());
    history.push("/tournaments");
  };

  const handleRigster = () => {
    console.log("Registering Now");
  };

  const handleFindMatch = () => {
    history.push("/match");
  };

  useEffect(() => {
    if (params.id && !currentTournament) dispatch(getTournament(params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentTournament) return <LoadingScreen />;
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Button startIcon={<BackIcon />} onClick={handleBack}>
        Go Back
      </Button>

      <Box width="100%" my={5}>
        <TournamentCard
          tournament={currentTournament}
          onRegister={
            currentTournament.state === TournamentStatus.SCHEDULED
              ? handleRigster
              : undefined
          }
          onFindMatch={
            currentTournament.state === TournamentStatus.ONGOING
              ? handleFindMatch
              : undefined
          }
        />
      </Box>
      <Pairings tournament={currentTournament} />
      <Members members={currentTournament.players} />
    </Box>
  );
};
