import React, { useCallback, useMemo, useState } from "react";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";

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

  const turnColor = useCallback(() => {
    return chess.turn() === "w" ? "white" : "black";
  }, [chess]);

  const calcMovable = useCallback(() => {
    const dests = new Map();
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
      if (chess.turn() === playerColorName && legalMoves && legalMoves.length) {
        for (let from of Object.keys(legals)) {
          dests.set(from, legals[from]);
        }
      } else {
        chess.SQUARES.forEach((s) => {
          const ms = chess.moves({ square: s, verbose: true });
          if (ms.length)
            dests.set(
              s,
              ms.map((m) => m.to)
            );
        });
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
      const moves = chess.moves({ verbose: true });

      for (let i = 0, len = moves.length; i < len; i++) {
        /* eslint-disable-line */
        if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
          setPendingMove([from, to]);
          setShowTransformPawn(true);
          return;
        }
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
        turnColor={turnColor()}
        movable={calcMovable()}
        check={chess.in_check() ? true : null}
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
