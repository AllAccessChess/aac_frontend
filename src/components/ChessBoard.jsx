import React, { useState } from "react";

import Chess from "chess.js";

import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";

import { Box, Button } from "@material-ui/core";
import TransformPawnDialog from "dialogs/TransformPawnDialog";

const ChessBoard = () => {
  const [chess, setChess] = useState(new Chess());
  const [pendingMove, setPendingMove] = useState();
  const [showTransformPawn, setShowTransformPawn] = useState(false);
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        setShowTransformPawn(true);
        return;
      }
    }
    if (chess.move({ from, to, promotion: "x" })) {
      setFen(chess.fen());
      setLastMove([from, to]);
      setTimeout(randomMove, 500);
    }
  };

  const randomMove = () => {
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      chess.move(move.san);
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
    }
  };

  const promotion = (e) => {
    const from = pendingMove[0];
    const to = pendingMove[1];
    chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    setLastMove([from, to]);
    setShowTransformPawn(false);
    setTimeout(randomMove, 500);
  };

  const turnColor = () => {
    return chess.turn() === "w" ? "white" : "black";
  };

  const calcMovable = () => {
    const dests = new Map();
    chess.SQUARES.forEach((s) => {
      const ms = chess.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to)
        );
    });
    return {
      free: false,
      dests,
      color: "white",
    };
  };

  const reset = () => {
    chess.reset();
    setFen(chess.fen());
    setLastMove(null);
  };

  const undo = () => {
    chess.undo();
    chess.undo();
    setFen(chess.fen());
    setLastMove(null);
  };

  return (
    <Box display="flex" justifyContent="flex-start">
      <Chessground
        width="38vw"
        height="38vw"
        turnColor={turnColor()}
        movable={calcMovable()}
        check={chess.in_check()}
        lastMove={lastMove}
        fen={fen}
        onMove={onMove}
        style={{
          marginRight: "20px",
          marginBottom: "20px",
        }}
      />
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
      <TransformPawnDialog open={showTransformPawn} onSubmit={promotion} />
    </Box>
  );
};

export default ChessBoard;
