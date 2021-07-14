import React, { useCallback, useMemo, useState } from "react";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";

import { TransformPawnDialog } from "components/dialogs";

export const ChessBoard = (props) => {
  const {
    chess,
    fen,
    inPast,
    width,
    height,
    playerColor,
    isSpectator,
    premove,
    lastMove,
    isPlaying,
    setPremove,
    onMove,
  } = props;

  const [showTransformPawn, setShowTransformPawn] = useState(false);
  const [pendingMove, setPendingMove] = useState();
  const playerColorName = useMemo(
    () => (playerColor === 0 ? "white" : "black"),
    [playerColor]
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
      chess.SQUARES.forEach((s) => {
        const ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
          dests.set(
            s,
            ms.map((m) => m.to)
          );
      });
    }
    return {
      free: false,
      dests,
      color: playerColorName,
    };
  }, [chess, isPlaying, playerColorName]);

  const handleMove = useCallback(
    (from, to) => {
      setPremove(null);
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
    [chess, setPremove, onMove, setPendingMove, setShowTransformPawn]
  );

  return (
    <>
      <Chessground
        width={width}
        height={height}
        viewOnly={isSpectator || inPast}
        turnColor={turnColor()}
        movable={calcMovable()}
        check={chess.in_check() ? true : false}
        lastMove={lastMove}
        fen={fen}
        orientation={playerColorName}
        premovable={{
          enabled: true,
          showDests: true,
          current: premove,
          events: {
            set: (orig, dest) => setPremove([orig, dest]),
            unset: () => setPremove(null),
          },
        }}
        onMove={handleMove}
        style={{
          marginRight: "20px",
          marginBottom: "20px",
        }}
      />
      <TransformPawnDialog open={showTransformPawn} onSubmit={promotion} />
    </>
  );
};
