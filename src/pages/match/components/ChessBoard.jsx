import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";

import { GameEvents, GameActions, GameStatus } from "constant";

import TransformPawnDialog from "components/dialogs/TransformPawnDialog";
import { addHistoryItem } from "redux/reducers/matchReducer";

export const ChessBoard = (props) => {
  const dispatch = useDispatch();
  const {
    chess,
    fen,
    width,
    height,
    gameClientRef,
    setFen,
    lastMove,
    gameStatus,
    setLastMove,
    pendingMove,
    setPendingMove,
    setGameStatus,
  } = props;

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
        setFen(chess.fen());
        setLastMove([from, to]);
        // setTimeout(randomMove, 500);
        gameClientRef.current.sendData({
          action: GameActions.move,
          message: from + to,
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
      dispatch(addHistoryItem({ action: "move", content: move }));
      setFen(chess.fen());
      setLastMove([from, to]);
      setShowTransformPawn(false);
      // setTimeout(randomMove, 500);
      gameClientRef.current.sendData({
        action: GameActions.move,
        message: from + to + e,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chess, pendingMove, setFen, setShowTransformPawn, setLastMove]
  );

  const turnColor = useCallback(() => {
    return chess.turn() === "w" ? "white" : "black";
  }, [chess]);

  const calcMovable = useCallback(() => {
    const dests = new Map();
    if (gameStatus === GameStatus.Started) {
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
      color: "white",
    };
  }, [chess, gameStatus]);

  const getResponse = useCallback(
    (data) => {
      console.log(data);
      if (data.moves && data.moves.length > 0) {
        const move = data.moves[data.moves.length - 1];
        const from = move.slice(0, 2);
        const to = move.slice(2);

        const chessMove = chess.move({ from, to, promotion: "x" });
        dispatch(addHistoryItem({ action: "move", content: chessMove }));
        setLastMove([from, to]);
      }
      if (data.fen) {
        setFen(data.fen);
      }
    },
    [dispatch, chess, setFen, setLastMove]
  );
  const initBoard = useCallback(() => {
    setGameStatus(GameStatus.Ready);
  }, [setGameStatus]);

  const setUpHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.on(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.on(GameEvents.Initialized, initBoard);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getResponse, initBoard]);

  const endHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.off(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.off(GameEvents.Initialized, initBoard);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getResponse, initBoard]);

  useEffect(() => {
    gameClientRef.current.connect();
    setUpHandlers();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gameClientRef.current.disconnect();
      endHandlers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameStatus === GameStatus.Started) {
      gameClientRef.current.sendData({
        action: GameActions.join,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  return (
    <>
      <Chessground
        width={width}
        height={height}
        turnColor={turnColor()}
        movable={calcMovable()}
        check={chess.in_check().toString()}
        lastMove={lastMove}
        fen={fen}
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
