import Chess from "chess.js";
import React, {
  createRef,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "@material-ui/core";
import { MyLocation as MyLocationIcon } from "@material-ui/icons";

import { ChessBoard } from "components/common";
import { Box, IconButton, Switch, Typography } from "components/material-ui";
import { useWindowSize } from "hooks";
import { useStockFishClient } from "lib/stock-fish";
import { getMatch } from "redux/reducers/matchReducer";
import {
  addToMoveTree,
  findFromMoveTree,
  getMovesFromTree,
  updateScore,
} from "utils/common";
import { MoveTree, Progress } from "./components";
import { MoveTreeHeader, MoveTreeWrapper } from "./styles";

export const Analysis = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const windowSize = useWindowSize();
  const params = useParams();
  const currentMatch = useSelector((state) => state.matchReducer.current);

  const [playerColor, setPlayerColor] = useState(0);
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [fen, setFen] = useState("start");
  const [premove, setPremove] = useState(null);
  const [lastMove, setLastMove] = useState();
  const [stockFishEnabled, setStockFishEnabled] = useState(false);
  const [threatEnabled, setThreatEnabled] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState("");
  const [currentScore, setCurrentScore] = useState(null);

  const [currentMoveId, setCurrentMoveId] = useState(null);
  const [moveVariation, setMoveVariation] = useState(null);

  const chess = useRef(new Chess());
  const chessContainerRef = createRef(null);

  const { stockFishClient } = useStockFishClient();

  useEffect(() => {
    if (stockFishClient) {
      stockFishClient.on("score", onStockFishScore);
      stockFishClient.on("possible-moves", onStockFishPossibleMoves);
    }

    return () => {
      stockFishClient.off("score", onStockFishScore);
      stockFishClient.off("possible-moves", onStockFishPossibleMoves);
    };
  }, [stockFishClient]);

  useEffect(() => {
    if (params.id) {
      dispatch(getMatch(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (currentMatch) {
      let moveTree = moveVariation;
      let currentPlayerColor = playerColor;
      let moveId = currentMoveId;

      for (const move of currentMatch.moves) {
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.slice(4) || "x";

        const chessMove = chess.current.move({
          from,
          to,
          promotion,
        });
        const fen = chess.current.fen();

        const newMoveId = uuidv4();
        moveTree = addToMoveTree(moveTree, moveId, newMoveId, chessMove, fen);

        setFen(fen);
        setLastMove([from, to]);

        currentPlayerColor = 1 - currentPlayerColor;
        moveId = newMoveId;
      }

      setPlayerColor(currentPlayerColor);

      setMoveVariation(moveTree);
      setCurrentMoveId(moveId);
    }
    // eslint-disable-next-line
  }, [currentMatch]);

  useEffect(() => {
    if (stockFishEnabled) {
      const moves = getMovesFromTree(moveVariation, currentMoveId);
      stockFishClient.go(moves, chess.current.turn() === "b" ? "w" : "b");
    } else {
      setCurrentScore(null);
    }
    // eslint-disable-next-line
  }, [currentMoveId, stockFishEnabled]);

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize, chessContainerRef]);

  useEffect(() => {
    if (currentScore !== null) {
      setMoveVariation(
        updateScore(
          moveVariation,
          currentMoveId,
          currentScore > 0 ? `+${currentScore}` : currentScore.toString()
        )
      );
    }
    // eslint-disable-next-line
  }, [currentScore]);

  useEffect(() => {
    setThreatEnabled(false);
  }, [stockFishEnabled, currentMoveId]);

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

  const toggleStockFishEnabled = () => {
    setStockFishEnabled((stockFishEnabled) => !stockFishEnabled);
  };

  const onStockFishScore = (score) => {
    setCurrentScore(score);
  };

  const onStockFishPossibleMoves = (pv) => {
    setPossibleMoves(pv);
  };

  const toggleThreadEnabled = () => {
    setThreatEnabled((threatEnabled) => !threatEnabled);
  };

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
            movable={{
              showDests: true,
              dests: { a2: ["a3", "a4"], b1: ["a3", "c3"] },
            }}
          />
        </Box>
        <MoveTreeWrapper>
          <MoveTreeHeader p={2}>
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Box mx={2}>
                <Typography variant="h4">
                  {currentScore
                    ? currentScore > 0
                      ? `+${currentScore}`
                      : currentScore.toString()
                    : ""}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" ml={2}>
                <Typography variant="body1">Stockfish 13+</Typography>
                <Typography variant="body2">in local browser</Typography>
              </Box>
            </Box>
            {stockFishEnabled && (
              <IconButton
                aria-label="threat"
                color={threatEnabled ? "secondary" : "default"}
                onClick={toggleThreadEnabled}
              >
                <MyLocationIcon />
              </IconButton>
            )}
            <Switch
              color="secondary"
              checked={stockFishEnabled}
              onChange={toggleStockFishEnabled}
            />
          </MoveTreeHeader>
          {stockFishEnabled && (
            <Box p={2}>
              <Typography variant="body2">{possibleMoves}</Typography>
            </Box>
          )}
          <Progress
            score={
              currentScore
                ? currentScore * (chess.current.turn() === "w" ? -1 : 1)
                : 0
            }
          />
          <MoveTree
            moveTree={moveVariation}
            currentMoveId={currentMoveId}
            onShowPast={handleShowPast}
          />
        </MoveTreeWrapper>
      </Box>
    </Box>
  );
};
