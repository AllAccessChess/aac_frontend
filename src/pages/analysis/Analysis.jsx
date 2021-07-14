import React, {
  createRef,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Helmet } from "react-helmet";
import Chess from "chess.js";

import { useWindowSize } from "hooks";
import StockFishClient from "utils/stockfish-client";

import { useTheme } from "@material-ui/core";
import { Box, Typography } from "components/material-ui";
import { ChessBoard } from "components/common";

export const Analysis = () => {
  const theme = useTheme();
  const windowSize = useWindowSize();
  const playerColor = 0; // white

  const [chess] = useState(new Chess());
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [fen, setFen] = useState("start");
  const botRef = useRef(
    new StockFishClient(chess, setFen, playerColor === 0 ? "white" : "black")
  );
  const [premove, setPremove] = useState(null);
  const [lastMove, setLastMove] = useState();

  const chessContainerRef = createRef(null);

  const handleMove = useCallback(
    (from, to, promot = "x") => {
      const move = chess.move({ from, to, promotion: promot });
      if (!move) return;
      setFen(chess.fen());
      setLastMove([from, to]);
      botRef.current.prepareMove();
    },
    [chess, setFen, setLastMove]
  );

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize, chessContainerRef]);

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      m={4}
      bgcolor={theme.palette.background.paper}
    >
      <Helmet title="Analysis" />
      <Typography variant="h3" mb={5}>
        Analysis
      </Typography>

      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        ref={chessContainerRef}
      >
        <ChessBoard
          width={chessBoardSize}
          height={chessBoardSize}
          chess={chess}
          fen={fen}
          playerColor={playerColor}
          isPlaying={true}
          inPast={false}
          isSpectator={false}
          lastMove={lastMove}
          premove={premove}
          setPremove={setPremove}
          onMove={handleMove}
        />
      </Box>
    </Box>
  );
};
