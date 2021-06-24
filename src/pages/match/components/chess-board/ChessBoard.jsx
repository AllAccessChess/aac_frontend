import React, { useState, useCallback, useMemo } from "react";
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
    width,
    height,
    playerColor,
    gameClientRef,
    setFen,
    lastMove,
    gameStatus,
    setLastMove,
    pendingMove,
    setPendingMove,
    setAskingDraw,
  } = props;
  const playerColorName = useMemo(
    () => (playerColor === 0 ? "white" : "black"),
    [playerColor]
  );

  const [showTransformPawn, setShowTransformPawn] = useState(false);

  // const randomMove = useCallback(() => {
  //   const moves = chess.moves({ verbose: true });
  //   const move = moves[Math.floor(Math.random() * moves.length)];
  //   console.log(move);
  //   if (moves.length > 0) {
  //     chess.move(move);
  //     dispatch(addHistoryItem(move));
  //     setFen(chess.fen());
  //     setLastMove([move.from, move.to]);
  //   }
  // }, [dispatch, chess, setFen, setLastMove]);

  const onMove = useCallback(
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
      const move = chess.move({ from, to, promotion: "x" });
      if (move) {
        console.log(move);
        dispatch(addHistoryItem({ action: "move", content: move }));
        console.log("***Setting Fen!");
        setFen(chess.fen());
        setLastMove([from, to]);
        // setTimeout(randomMove, 500);
        console.log("Send Move: ", from + to);
        setAskingDraw(false);
        gameClientRef.current.sendData({
          action: GameActions.MOVE,
          game: gameClientRef.current.gameId,
          move: from + to,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, chess, setShowTransformPawn, setFen, setLastMove, setPendingMove]
  );

  const promotion = useCallback(
    (e) => {
      const from = pendingMove[0];
      const to = pendingMove[1];
      const move = chess.move({ from, to, promotion: e });
      if (move) {
        dispatch(addHistoryItem({ action: "move", content: move }));
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
        turnColor={turnColor()}
        movable={calcMovable()}
        check={chess.in_check() ? true : false}
        lastMove={lastMove}
        fen={fen}
        orientation={playerColorName}
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
