import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import useInterval from "react-useinterval";
import { ChevronLeft as BackIcon } from "@material-ui/icons";

import { TournamentStatus, RoundStatus, GameResults } from "constant";
import { LoadingScreen, TournamentCard } from "components/common";
import { Box, Button } from "components/material-ui";
import { isAdmin } from "utils/common";
import {
  getTournament,
  clearCurrent as clearCurrentTournament,
  registerTournament,
  unRegisterTournament,
  startRound,
} from "redux/reducers/tournamentReducer";
import { downloadPGN } from "redux/reducers/matchReducer";

import { Byes, Chat, Members, Pairings } from "./components";

export const TournamentDetail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );
  const byeSaving = useSelector((state) => state.tournamentReducer.byeSaving);
  const user = useSelector((state) => state.authReducer.user);

  const tournamentStarted = useMemo(
    () =>
      currentTournament &&
      currentTournament.start < new Date().getTime() &&
      currentTournament.rounds.some(
        (round) => round.state < RoundStatus.FINISHED
      ),
    [currentTournament]
  );
  const currentRoundIndex = useMemo(
    () =>
      currentTournament
        ? currentTournament.rounds.findIndex(
            (round) => round.state < RoundStatus.FINISHED
          )
        : -1,
    [currentTournament]
  );
  const pollingTournamentRoundCondition = useMemo(
    () => currentTournament && tournamentStarted && currentRoundIndex >= 0,
    [currentTournament, tournamentStarted, currentRoundIndex]
  );
  const joinedRoundBoardIndex = useMemo(
    () =>
      currentTournament && currentRoundIndex > -1
        ? currentTournament.rounds[currentRoundIndex].boards.findIndex(
            (board) =>
              board.playerIds.findIndex((id) => id === user && user.id) > -1
          )
        : -1,
    [currentTournament, currentRoundIndex, user]
  );

  const registerCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED &&
      !currentTournament.players.find((item) => item.id === user.id),
    [user, currentTournament]
  );
  const unRegisterCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED &&
      currentTournament.players.find((item) => item.id === user.id),
    [user, currentTournament]
  );
  const findMatchCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.ONGOING,
    [user, currentTournament]
  );
  const joinLobbyCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.ONGOING &&
      currentRoundIndex > -1 &&
      currentTournament.rounds[currentRoundIndex].state ===
        RoundStatus.PLAYING &&
      currentTournament.rounds[currentRoundIndex].start <=
        new Date().getTime() &&
      joinedRoundBoardIndex > -1 &&
      currentTournament.rounds[currentRoundIndex].boards[joinedRoundBoardIndex]
        .result === GameResults.ONGOING,
    [user, currentTournament, currentRoundIndex, joinedRoundBoardIndex]
  );
  const startRoundCondition = useMemo(
    () =>
      user &&
      user.id &&
      isAdmin(user) &&
      currentRoundIndex > -1 &&
      currentTournament &&
      currentTournament.rounds[currentRoundIndex].start <=
        new Date().getTime() &&
      currentTournament.rounds[currentRoundIndex].state === RoundStatus.SETUP,
    [user, currentRoundIndex, currentTournament]
  );
  const byeCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED,
    [user, currentTournament]
  );
  const chatCondition = useMemo(() => user && user.id && currentTournament, [
    user,
    currentTournament,
  ]);

  useInterval(() => {
    if (pollingTournamentRoundCondition) {
      console.log("Polling Tournament Round");
      dispatch(getTournament(currentTournament.id));
    }
  }, [pollingTournamentRoundCondition ? 10000 : null]);

  const handleBack = () => {
    dispatch(clearCurrentTournament());
    history.push("/tournaments");
  };

  const handleDownloadPGN = (gameID, roundTitle) => {
    dispatch(downloadPGN(gameID, roundTitle));
    // dispatch(downloadPGN("60c8a855a2f4807757ce30cb", roundTitle));
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

  const handleJoinLobby = () => {
    history.push(`/match/${currentTournament.id}`);
  };

  const handleStartRound = () => {
    dispatch(startRound(currentTournament.id));
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
          currentRoundIndex={currentRoundIndex}
          onRegister={registerCondition && handleRegister}
          onUnRegister={unRegisterCondition && handleUnRegister}
          onFindMatch={findMatchCondition && handleFindMatch}
          onJoinLobby={joinLobbyCondition && handleJoinLobby}
          onStartRound={startRoundCondition && handleStartRound}
        />
      </Box>
      <Pairings
        tournament={currentTournament}
        currentRoundIndex={currentRoundIndex}
        onDownloadPGN={handleDownloadPGN}
        onManagePairings={handleManagePairings}
      />
      {byeCondition && (
        <Byes
          tournament={currentTournament}
          byeSaving={byeSaving}
          byes={currentTournament.rounds.map((round) =>
            round.byes.includes(user.id)
          )}
        />
      )}
      <Box width="100%" my={5}>
        <Members
          user={user}
          members={currentTournament.players}
          rounds={currentTournament.rounds}
        />
      </Box>
      {chatCondition && <Chat />}
    </Box>
  );
};
