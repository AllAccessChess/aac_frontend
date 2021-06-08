import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";

// import config from "config";
// import GameClient from "utils/gameClient";
// import GameClient, { GAME_EVENTS, GAME_ACTIONS } from "utils/gameClient";

import TransformPawnDialog from "dialogs/TransformPawnDialog";
import { addHistoryItem } from "redux/reducers/matchReducer";

const ChessBoard = (props) => {
  const dispatch = useDispatch();
  const {
    chess,
    fen,
    setFen,
    lastMove,
    setLastMove,
    pendingMove,
    setPendingMove,
  } = props;

  const [showTransformPawn, setShowTransformPawn] = useState(false);

  // const gameClientRef = useRef(new GameClient(config.socketURL));

  const randomMove = useCallback(() => {
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    console.log(move);
    if (moves.length > 0) {
      chess.move(move);
      dispatch(addHistoryItem(move));
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
    }
  }, [dispatch, chess, setFen, setLastMove]);

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
        dispatch(addHistoryItem(move));
        setFen(chess.fen());
        setLastMove([from, to]);
        setTimeout(randomMove, 500);
        // gameClientRef.current.sendData({
        //   action: GAME_ACTIONS.move,
        //   message: from + to,
        // });
      }
    },
    [
      dispatch,
      chess,
      setShowTransformPawn,
      setFen,
      setLastMove,
      setPendingMove,
      randomMove,
    ]
  );

  const promotion = useCallback(
    (e) => {
      const from = pendingMove[0];
      const to = pendingMove[1];
      chess.move({ from, to, promotion: e });
      setFen(chess.fen());
      setLastMove([from, to]);
      setShowTransformPawn(false);
      setTimeout(randomMove, 500);
    },
    [chess, pendingMove, setFen, setShowTransformPawn, randomMove, setLastMove]
  );

  const turnColor = useCallback(() => {
    return chess.turn() === "w" ? "white" : "black";
  }, [chess]);

  const calcMovable = useCallback(() => {
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
  }, [chess]);

  // const getResponse = useCallback(
  //   (data) => {
  //     console.log(data);
  //     if (data.moves.length > 0) {
  //       const move = data.moves[data.moves.length - 1];
  //       const from = move.slice(0, 2);
  //       const to = move.slice(2);

  //       chess.move({ from, to, promotion: "x" });
  //       setFen(data.fen);
  //       setLastMove([from, to]);
  //     }
  //   },
  //   [chess, setFen, setLastMove]
  // );

  // const setUpHandlers = useCallback(() => {
  //   if (gameClientRef.current) {
  //     gameClientRef.current.on(GAME_EVENTS.GET_RESPONSE, getResponse);
  //   }
  // }, [getResponse]);

  // const endHandlers = useCallback(() => {
  //   if (gameClientRef.current) {
  //     gameClientRef.current.off(GAME_EVENTS.GET_RESPONSE, getResponse);
  //   }
  // }, [getResponse]);

  // useEffect(() => {
  //   gameClientRef.current.connect();
  //   setUpHandlers();
  //   return () => {
  //     gameClientRef.current.disconnect();
  //     endHandlers();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
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
      <TransformPawnDialog open={showTransformPawn} onSubmit={promotion} />
    </>
  );
};

export default ChessBoard;
