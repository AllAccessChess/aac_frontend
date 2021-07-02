import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { ChevronLeft as BackIcon } from "@material-ui/icons";
import { Box, Button } from "components/material-ui";
import { LoadingScreen, TournamentCard } from "components/common";
import { Pairings, Members, Byes } from "./components";

import { TournamentStatus } from "constant";
import {
  getTournament,
  clearCurrent as clearCurrentTournament,
  registerTournament,
  unRegisterTournament,
} from "redux/reducers/tournamentReducer";
import { downloadPGN } from "redux/reducers/matchReducer";

export const TournamentDetail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );
  const byeSaving = useSelector((state) => state.tournamentReducer.byeSaving);
  const user = useSelector((state) => state.authReducer.user);

  const handleBack = () => {
    dispatch(clearCurrentTournament());
    history.push("/tournaments");
  };

  const handleDownloadPGN = (gameID, roundTitle) => {
    // dispatch(downloadPGN(gameID));
    dispatch(downloadPGN("60c8a855a2f4807757ce30cb", roundTitle));
  };

  const handleRegister = () => {
    dispatch(registerTournament(currentTournament.id));
  };

  const handleUnRegister = () => {
    dispatch(unRegisterTournament(currentTournament.id));
  };

  const handleFindMatch = () => {
    history.push("/match");
  };

  const handleManagePairings = (roundId) => {
    history.push(`/tournament/${params.id}/round/${roundId}/pairing`);
  };

  useEffect(() => {
    if (params.id) {
      dispatch(getTournament(params.id));
    }
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
            currentTournament.state === TournamentStatus.SCHEDULED &&
            !currentTournament.players.find((item) => item.id === user.id)
              ? handleRegister
              : undefined
          }
          onUnRegister={
            currentTournament.state === TournamentStatus.SCHEDULED &&
            currentTournament.players.find((item) => item.id === user.id)
              ? handleUnRegister
              : undefined
          }
          onFindMatch={
            currentTournament.state === TournamentStatus.ONGOING
              ? handleFindMatch
              : undefined
          }
        />
      </Box>
      <Pairings
        tournament={currentTournament}
        onDownloadPGN={handleDownloadPGN}
        onManagePairings={handleManagePairings}
      />
      {currentTournament.state === TournamentStatus.SCHEDULED ? (
        <Byes
          tournament={currentTournament}
          byeSaving={byeSaving}
          byes={currentTournament.rounds.map((round) =>
            round.byes.includes(user.id)
          )}
        />
      ) : (
        <></>
      )}

      <Members
        user={user}
        members={currentTournament.players}
        rounds={currentTournament.rounds}
      />
    </Box>
  );
};
