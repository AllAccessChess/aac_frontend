import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Chessground from "react-chessground";
import useInterval from "react-useinterval";
import "react-chessground/dist/styles/chessground.css";

import { GameActions, GameStatus } from "constant";

import { TransformPawnDialog } from "components/dialogs";
import { addHistoryItem } from "redux/reducers/matchReducer";

export const ChessBoard = (props) => {
  const dispatch = useDispatch();
  const {
    chess,
    fen,
    inPast,
    width,
    height,
    playerColor,
    isSpectator,
    premove,
    showTransformPawn,
    gameClientRef,
    setFen,
    setPremove,
    lastMove,
    gameStatus,
    setLastMove,
    pendingMove,
    setAskingDraw,
    setShowTransformPawn,
    onMove,
  } = props;
  const playerColorName = useMemo(
    () => (playerColor === 0 ? "white" : "black"),
    [playerColor]
  );

  const promotion = useCallback(
    (e) => {
      const from = pendingMove[0];
      const to = pendingMove[1];
      const move = chess.move({ from, to, promotion: e });
      if (move) {
        dispatch(
          addHistoryItem({ action: "move", content: move, fen: chess.fen() })
        );
        console.log("***Setting Fen!");
        setFen(chess.fen());
        setLastMove([from, to]);
        setShowTransformPawn(false);
        // setTimeout(randomMove, 500);
        console.log("Send Move: ", from + to + e);
        setAskingDraw(false);
        gameClientRef.current.sendData({
          action: GameActions.MOVE,
          game: gameClientRef.current.gameId,
          move: from + to + e,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chess, pendingMove, setFen, setShowTransformPawn, setLastMove]
  );

  const turnColor = useCallback(() => {
    return chess.turn() === "w" ? "white" : "black";
  }, [chess]);

  const calcMovable = useCallback(() => {
    const dests = new Map();
    if (gameStatus === GameStatus.PLAYING) {
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
  }, [chess, gameStatus, playerColorName]);

  // Interval for Ping-Pong ;)
  useInterval(
    () => {
      if (gameStatus !== GameStatus.IDLE && gameStatus !== GameStatus.EXITED) {
        console.log(gameStatus);
        gameClientRef.current.sendData({
          action: GameActions.PING,
        });
      }
    },
    gameStatus !== GameStatus.IDLE && gameStatus !== GameStatus.EXITED
      ? 10000
      : null
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
        onMove={onMove}
        style={{
          marginRight: "20px",
          marginBottom: "20px",
        }}
      />
      <TransformPawnDialog open={showTransformPawn} onSubmit={promotion} />
    </>
  );
};
