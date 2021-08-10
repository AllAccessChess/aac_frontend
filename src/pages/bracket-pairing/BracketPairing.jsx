import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Box, CircularProgress, Typography } from "components/material-ui";
import {
  getTournament,
  updatePairings,
  updateTournament,
} from "redux/reducers/tournamentReducer";
import { BracketPairing as SingleBracketPairing } from "./components";
import { getBracketPairings } from "utils/common";

export const BracketPairing = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [brackets, setBrackets] = useState(null);
  const tournament = useSelector((state) => state.tournamentReducer);

  const roundNum = parseInt(params.roundId);

  useEffect(() => {
    if (params.tournamentId) {
      dispatch(getTournament(params.tournamentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tournament.current) {
      setBrackets(
        tournament.current.settings.brackets
          .map((bracket, index) => ({
            index: index,
            upper: bracket.length > 1 ? bracket[1] : 9999,
            merged: tournament.current.settings.merges.indexOf(index) > -1,
          }))
          .sort((b1, b2) => b1.upper - b2.upper)
      );
    }
  }, [tournament]);

  useEffect(() => {
    if (tournament.current && brackets) {
      const merges = brackets
        .filter((bracket) => bracket.merged)
        .sort((b1, b2) => b1.index - b2.index)
        .map((bracket) => bracket.index);

      if (merges.join(",") !== tournament.current.settings.merges.join(",")) {
        dispatch(
          updateTournament({
            ...tournament.current,
            settings: {
              ...tournament.current.settings,
              merges,
            },
          })
        );
      }
    }
  }, [brackets, dispatch, tournament]);

  const handleUpdatePairings = (bracketIndex, pairings) => {
    dispatch(
      updatePairings(tournament.current.id, bracketIndex, roundNum, pairings)
    );
  };

  const handleUpdateMerge = (bracketIndex) => {
    setBrackets((brackets) =>
      brackets.map((bracket) => ({
        ...bracket,
        merged:
          bracket.index === bracketIndex ? !bracket.merged : bracket.merged,
      }))
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      width="100%"
    >
      {tournament.loading || !tournament.current ? (
        <CircularProgress />
      ) : (
        <React.Fragment>
          <Typography variant="h4" my={3}>
            {tournament.current.title} - Round {roundNum + 1} - Pairings
          </Typography>
          <Box flexGrow={1} flexDirection="column" width="100%">
            {brackets.map((bracket, index) => {
              const { boards, byes, unpaired, players } = getBracketPairings(
                tournament.current,
                brackets,
                bracket.index,
                roundNum
              );

              return (
                <SingleBracketPairing
                  key={bracket.index}
                  boards={boards}
                  byes={byes}
                  unpaired={unpaired}
                  players={players}
                  bracket={bracket}
                  prevBracket={index > 0 ? brackets[index - 1] : null}
                  showTree={roundNum === 0}
                  last={index === brackets.length - 1}
                  onUpdate={handleUpdatePairings}
                  onMerge={handleUpdateMerge}
                />
              );
            })}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
