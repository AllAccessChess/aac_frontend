import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Typography } from "@material-ui/core";
import ScreenLoader from "components/common/ScreenLoader";
import ChessBoard from "components/ChessBoard";

import {
  getMatch,
  setHistory,
  popHistoryItem,
} from "redux/reducers/matchReducer";

const Match = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [pendingMove, setPendingMove] = useState();

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const moveHistory = useSelector((state) => state.matchReducer.history);

  const reset = useCallback(() => {
    chess.reset();
    setFen(chess.fen());
    setLastMove(null);
    dispatch(setHistory([]));
  }, [dispatch, chess, setFen, setLastMove]);

  const undo = useCallback(() => {
    chess.undo();
    chess.undo();
    setFen(chess.fen());
    setLastMove(null);
    dispatch(popHistoryItem(2));
  }, [dispatch, chess, setFen, setLastMove]);

  useEffect(() => {
    if (params.id && !currentMatch) {
      dispatch(getMatch(params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentMatch) return <ScreenLoader />;
  return (
    <Box width="100%" display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
      >
        <h2>
          {currentMatch.black}(Black) vs {currentMatch.white}(White)
        </h2>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="flex-start"
          width="150px"
        >
          <Button variant="outlined" color="secondary" onClick={reset}>
            Reset
          </Button>
          <Button variant="outlined" color="secondary" onClick={undo}>
            Undo
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">{currentMatch.black}</Typography>
          <ChessBoard
            chess={chess}
            fen={fen}
            lastMove={lastMove}
            pendingMove={pendingMove}
            setFen={setFen}
            setLastMove={setLastMove}
            setPendingMove={setPendingMove}
          />
          <Typography variant="h6">{currentMatch.white}</Typography>
        </Box>

        <Box display="flex" flexDirection="column">
          {moveHistory.map((move, index) => (
            <Typography key={index}>
              {index + 1} {move.san}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Match;
