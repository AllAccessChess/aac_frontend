import React, { useCallback, useMemo, useState } from "react";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
import { chessgroundDests } from "chessops/compat";
import { parseSquare } from "chessops/util";

import { TransformPawnDialog } from "components/dialogs";

export const ChessBoard = (props) => {
  const {
    chess,
    chessgroundRef,
    fen,
    inPast,
    width,
    height,
    playerColor,
    isSpectator,
    lastMove,
    isPlaying,
    setPremove,
    onMove,
    drawable,
    animation,
    disableOrientation = false,
    legalMoves = [],
  } = props;

  const [showTransformPawn, setShowTransformPawn] = useState(false);
  const [pendingMove, setPendingMove] = useState();
  const playerColorName = useMemo(
    () => (playerColor === 0 ? "white" : "black"),
    [playerColor]
  );

  const premovable = useMemo(
    () => ({
      enabled: true,
      showDests: true,
      castle: true,
      events: {
        set: (orig, dest) => setPremove([orig, dest]),
        unset: () => setPremove(null),
      },
    }),
    [setPremove]
  );

  const promotion = useCallback(
    (e) => {
      setShowTransformPawn(false);
      onMove(pendingMove[0], pendingMove[1], e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingMove, setShowTransformPawn, onMove]
  );

  const calcMovable = useCallback(() => {
    let dests = new Map();
    if (isPlaying) {
      let legals = {};
      if (legalMoves && legalMoves.length) {
        for (let move of legalMoves) {
          const from = move.slice(0, 2);
          const to = move.slice(2, 4);
          if (!legals[from]) legals[from] = [];
          legals[from].push(to);
        }
      }
      if (chess.turn === playerColorName && legalMoves && legalMoves.length) {
        for (let from of Object.keys(legals)) {
          dests.set(from, legals[from]);
        }
      } else {
        dests = chessgroundDests(chess);
      }
    }

    return {
      free: false,
      dests,
      color: playerColorName,
    };
  }, [chess, isPlaying, playerColorName, legalMoves]);

  const handleMove = useCallback(
    (from, to) => {
      const fromSquare = parseSquare(from);
      const piece = chess.board.get(fromSquare);

      if (piece && piece.role === "pawn" && (to[1] === "8" || to[1] === "1")) {
        setPendingMove([from, to]);
        setShowTransformPawn(true);
        return;
      }

      onMove(from, to);
    },
    [chess, onMove, setPendingMove, setShowTransformPawn]
  );

  return (
    <>
      <Chessground
        ref={chessgroundRef}
        width={width}
        height={height}
        viewOnly={isSpectator || inPast}
        turnColor={chess.turn}
        movable={calcMovable()}
        check={chess.isCheck() ? true : null}
        lastMove={lastMove}
        fen={fen}
        orientation={disableOrientation ? "white" : playerColorName}
        premovable={premovable}
        onMove={handleMove}
        style={{
          marginRight: "20px",
          marginBottom: "20px",
        }}
        drawable={drawable}
        animation={animation}
      />
      <TransformPawnDialog open={showTransformPawn} onSubmit={promotion} />
    </>
  );
};
