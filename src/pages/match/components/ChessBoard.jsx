import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Chessground from "react-chessground";
import useInterval from "react-useinterval";
import "react-chessground/dist/styles/chessground.css";

import { GameEvents, GameActions, GameStatus } from "constant";

import TransformPawnDialog from "components/dialogs/TransformPawnDialog";
import { addHistoryItem } from "redux/reducers/matchReducer";
import { getAuthToken } from "utils/storage";

export const ChessBoard = (props) => {
  const dispatch = useDispatch();
  const {
    chess,
    fen,
    width,
    height,
    players,
    user,
    gameClientRef,
    setFen,
    lastMove,
    gameStatus,
    setLastMove,
    pendingMove,
    setPendingMove,
    setGameStatus,
    setPlayers,
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
        setFen(chess.fen());
        setLastMove([from, to]);
        setShowTransformPawn(false);
        // setTimeout(randomMove, 500);
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
      color: user.id === players[0] ? "white" : "black",
    };
  }, [chess, gameStatus, user, players]);

  const getResponse = useCallback(
    (data) => {
      if (data.game) {
        if (data.state === GameStatus.PLAYING)
          setGameStatus(GameStatus.PLAYING);
        if (!players.length && data.game.players.length > 1)
          setPlayers(data.game.players.map((item) => item.id));
        if (data.game.moves && data.game.moves.length > 0) {
          const move = data.game.moves[data.game.moves.length - 1];
          if (move) {
            const from = move.slice(0, 2);
            const to = move.slice(2, 4);
            const e = move.slice(4) || "x";

            const chessMove = chess.move({ from, to, promotion: e });
            console.log("chessMove: ", chessMove);
            if (chessMove) {
              dispatch(addHistoryItem({ action: "move", content: chessMove }));
              setLastMove([from, to]);
            }
          }
        }
        if (data.game.fen) {
          setFen(data.game.fen);
        }
      }
    },
    [dispatch, chess, setFen, setLastMove, players, setPlayers, setGameStatus]
  );
  const onOpenedSocket = useCallback(() => {
    console.log(
      "Opened Socket, authenticating with token: ",
      getAuthToken().token
    );
    gameClientRef.current.sendData({
      action: GameActions.AUTH,
      token: getAuthToken().token,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onAuthenticatedSocket = useCallback(
    (data) => {
      console.log("Authenticated Socket");
      // gameClientRef.current.sendData({
      //   action: GameActions.STATUS,
      // });
      if (data.state === GameStatus.PLAYING) setGameStatus(GameStatus.PLAYING);
      else {
        console.log("Seeking now");
        gameClientRef.current.sendData({
          action: GameActions.SEEK,
        });
        setGameStatus(GameStatus.SEEKING);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setGameStatus]
  );

  const setUpHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.on(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.on(GameEvents.OPENED, onOpenedSocket);
      gameClientRef.current.on(GameEvents.AUTHENTICATED, onAuthenticatedSocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getResponse, onOpenedSocket, onAuthenticatedSocket]);

  const endHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.off(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.off(GameEvents.OPENED, onOpenedSocket);
      gameClientRef.current.off(
        GameEvents.AUTHENTICATED,
        onAuthenticatedSocket
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getResponse, onOpenedSocket, onAuthenticatedSocket]);

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
