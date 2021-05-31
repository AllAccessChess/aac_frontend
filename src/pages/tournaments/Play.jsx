import React, { useState } from "react";

import { Box, Modal } from "@material-ui/core";
import Chess from "chess.js";
import Chessground from "react-chessground";
// import "assets/styles/chessground.css";
import "react-chessground/dist/styles/chessground.css";

import queen from "assets/images/wQ.svg";
import rook from "assets/images/wR.svg";
import bishop from "assets/images/wB.svg";
import knight from "assets/images/wN.svg";

const Play = () => {
  const [chess, setChess] = useState(new Chess());
  const [pendingMove, setPendingMove] = useState();
  const [selectVisible, setSelectVisible] = useState(false);
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        setSelectVisible(true);
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
    setSelectVisible(false);
    setTimeout(randomMove, 500);
  };

  const turnColor = () => {
    return chess.turn() === "w" ? "white" : "black";
  };

  // const calcMovable = () => {
  //   const dests = new Map();
  //   chess.SQUARES.forEach((s) => {
  //     const ms = chess.moves({ square: s, verbose: true });
  //     if (ms.length)
  //       dests.set(
  //         s,
  //         ms.map((m) => m.to)
  //       );
  //   });
  //   return {
  //     free: false,
  //     dests,
  //     color: "white",
  //   };
  // };

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <h2>Play Page</h2>
      <Chessground
        width="38vw"
        height="38vw"
        turnColor={turnColor()}
        // movable={calcMovable()}
        lastMove={lastMove}
        fen={fen}
        onMove={onMove}
        style={{ margin: "auto" }}
      />
      <Modal open={selectVisible}>
        <div style={{ textAlign: "center", cursor: "pointer" }}>
          <span role="presentation" onClick={() => promotion("q")}>
            <img src={queen} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion("r")}>
            <img src={rook} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion("b")}>
            <img src={bishop} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion("n")}>
            <img src={knight} alt="" style={{ width: 50 }} />
          </span>
        </div>
      </Modal>
    </Box>
  );
};

export default Play;
