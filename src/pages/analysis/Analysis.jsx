import Chess from "chess.js";
import React, {
  createRef,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Helmet } from "react-helmet";
import { useTheme } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

import { ChessBoard } from "components/common";
import { Box, Switch, Typography } from "components/material-ui";
import { useWindowSize } from "hooks";
import { addToMoveTree, findFromMoveTree } from "utils/common";
import StockFishClient from "utils/stockfish-client";
import { MoveTree } from "./components";

export const Analysis = () => {
  const theme = useTheme();
  const windowSize = useWindowSize();

  const [playerColor, setPlayerColor] = useState(0);
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [fen, setFen] = useState("start");
  const [premove, setPremove] = useState(null);
  const [lastMove, setLastMove] = useState();
  // const [moveHistory, setMoveHistory] = useState([]);

  const [currentMoveId, setCurrentMoveId] = useState(null);
  const [moveVariation, setMoveVariation] = useState(null);

  const chess = useRef(new Chess());
  const chessContainerRef = createRef(null);

  const botRef = useRef(null);

  useEffect(() => {
    botRef.current = new StockFishClient(
      chess.current,
      playerColor === 0 ? "white" : "black"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMove = useCallback(
    (from, to, promot = "x") => {
      const move = chess.current.move({ from, to, promotion: promot });
      const fen = chess.current.fen();

      if (!move || !fen) return;

      const moveId = uuidv4();
      const moveTree = addToMoveTree(
        moveVariation,
        currentMoveId,
        moveId,
        move,
        fen
      );

      setMoveVariation(moveTree);
      setCurrentMoveId(moveId);

      setFen(fen);
      setLastMove([from, to]);
      setPlayerColor((playerColor) => 1 - playerColor);
    },
    [currentMoveId, moveVariation]
  );

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize, chessContainerRef]);

  const handleShowPast = useCallback(
    (moveId) => {
      setCurrentMoveId(moveId);

      const moveTree = findFromMoveTree(moveVariation, moveId);

      if (moveTree) {
        chess.current.load(moveTree.fen);

        setFen(moveTree.fen);
        setLastMove([moveTree.move.from, moveTree.move.to]);
        setPlayerColor(moveTree.level % 2);
      }
    },
    [moveVariation, setLastMove, setFen]
  );

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

      <Box flexGrow={1} display="flex">
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
            chess={chess.current}
            fen={fen}
            playerColor={playerColor}
            isPlaying={true}
            inPast={false}
            isSpectator={false}
            lastMove={lastMove}
            premove={premove}
            setPremove={setPremove}
            onMove={handleMove}
            disableOrientation
          />
        </Box>
        <Box borderRadius={8} bgcolor={theme.palette.background.default}>
          <Box display="flex" alignItems="center" flexGrow={1} p={2}>
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Typography variant="h4">+2.0</Typography>
              <Box display="flex" flexDirection="column" ml={2}>
                <Typography variant="body1">Stockfish 13+</Typography>
                <Typography variant="body2">in local browser</Typography>
              </Box>
            </Box>
            <Switch color="secondary" checked={false} />
          </Box>
          <MoveTree
            moveTree={moveVariation}
            currentMoveId={currentMoveId}
            onShowPast={handleShowPast}
          />
        </Box>
      </Box>
    </Box>
  );
};
