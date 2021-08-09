import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import useInterval from "react-useinterval";

import { TournamentStatus, RoundStatus, GameResults } from "constant";
import { LoadingScreen, TournamentCard } from "components/common";
import { Box } from "components/material-ui";
import { isAdmin } from "utils/common";
import {
  getTournament,
  registerTournament,
  unRegisterTournament,
  startRound,
  setCurrent as setCurrentTournament,
  adjustGameResultInRound,
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

  const [currentBracketIndex, setCurrentBracketIndex] = useState(0);

  const tournamentStarted = useMemo(
    () =>
      currentTournament &&
      currentTournament.start < new Date().getTime() &&
      currentTournament.brackets[currentBracketIndex].rounds.some(
        (round) => round.state < RoundStatus.FINISHED
      ),
    [currentTournament, currentBracketIndex]
  );
  const currentRoundIndex = useMemo(
    () =>
      currentTournament
        ? currentTournament.brackets[currentBracketIndex].rounds.findIndex(
            (round) => round.state < RoundStatus.FINISHED
          )
        : -1,
    [currentTournament, currentBracketIndex]
  );
  const currentRound = useMemo(
    () =>
      currentTournament && currentRoundIndex >= 0
        ? currentTournament.brackets[currentBracketIndex].rounds[
            currentRoundIndex
          ]
        : null,
    [currentTournament, currentBracketIndex, currentRoundIndex]
  );
  const joinedBracketIndex = useMemo(
    () =>
      user && user.id && currentTournament
        ? currentTournament.brackets.findIndex((bracket) =>
            bracket.players.find((player) => player.id === user.id)
          )
        : -1,
    [currentTournament, user]
  );

  const pollingTournamentRoundCondition = useMemo(
    () => currentTournament && tournamentStarted && currentRound,
    [currentTournament, tournamentStarted, currentRound]
  );
  const joinedRoundBoardIndex = useMemo(
    () =>
      currentTournament && currentRound && user && user.id
        ? currentRound.boards.findIndex(
            (board) => board.playerIds.findIndex((id) => id === user.id) > -1
          )
        : -1,
    [currentTournament, currentRound, user]
  );

  const registerCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED &&
      joinedBracketIndex === -1,
    [user, currentTournament, joinedBracketIndex]
  );

  const unRegisterCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED &&
      joinedBracketIndex > -1,
    [user, currentTournament, joinedBracketIndex]
  );
  const findMatchCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.ONGOING,
    [user, currentTournament]
  );
  const joinMatchCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.ONGOING &&
      currentRound &&
      currentRound.state === RoundStatus.PLAYING &&
      currentRound.start <= new Date().getTime() &&
      joinedRoundBoardIndex > -1 &&
      currentRound.boards[joinedRoundBoardIndex].result === GameResults.ONGOING,
    [user, currentTournament, currentRound, joinedRoundBoardIndex]
  );
  const startRoundCondition = useMemo(
    () =>
      user &&
      user.id &&
      isAdmin(user) &&
      currentRound &&
      currentTournament &&
      currentTournament.state === TournamentStatus.ONGOING &&
      currentRound.start <= new Date().getTime() &&
      currentRound.state === RoundStatus.SETUP,
    [user, currentRound, currentTournament]
  );

  const byeCondition = useMemo(
    () =>
      user &&
      user.id &&
      currentTournament &&
      currentTournament.state === TournamentStatus.SCHEDULED &&
      joinedBracketIndex > -1,
    [user, currentTournament, joinedBracketIndex]
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

  const handleDownloadPGN = (gameID, roundTitle) => {
    dispatch(downloadPGN(gameID, roundTitle));
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

  const handleJoinMatch = () => {
    history.push(`/match/${currentTournament.id}`);
  };

  const handleStartRound = () => {
    dispatch(startRound(currentTournament.id));
  };

  const handleManagePairings = (bracketId, roundId) => {
    history.push(`/tournament/${params.id}/${bracketId}/${roundId}/pairing`);
  };

  const handleUpdateTournament = (
    tournament,
    bracketIndex,
    roundIndex,
    payload,
    callback
  ) => {
    dispatch(
      adjustGameResultInRound(
        tournament,
        bracketIndex,
        roundIndex,
        payload,
        (updatedTournament) => {
          dispatch(setCurrentTournament(updatedTournament));
          if (callback) callback();
        },
        () => {
          if (callback) callback();
        }
      )
    );
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
      <Box width="100%" my={5}>
        <TournamentCard
          tournament={currentTournament}
          currentRound={currentRound}
          onRegister={registerCondition && handleRegister}
          onUnRegister={unRegisterCondition && handleUnRegister}
          onFindMatch={findMatchCondition && handleFindMatch}
          onJoinMatch={joinMatchCondition && handleJoinMatch}
          onStartRound={startRoundCondition && handleStartRound}
        />
      </Box>
      <Pairings
        tournament={currentTournament}
        currentBracketIndex={currentBracketIndex}
        setCurrentBracketIndex={setCurrentBracketIndex}
        currentRoundIndex={currentRoundIndex}
        onDownloadPGN={handleDownloadPGN}
        onManagePairings={handleManagePairings}
        onUpdateMatchResult={handleUpdateTournament}
      />
      {byeCondition && (
        <Byes
          tournament={currentTournament}
          byeSaving={byeSaving}
          byes={currentTournament.brackets[
            joinedBracketIndex
          ].rounds.map((round) => round.byes.includes(user.id))}
        />
      )}
      <Box width="100%" my={5}>
        <Members user={user} tournament={currentTournament} />
      </Box>
      {chatCondition && <Chat />}
    </Box>
  );
};
