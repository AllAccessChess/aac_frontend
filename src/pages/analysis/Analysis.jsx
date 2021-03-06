import React, {
  createRef,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import useSound from "use-sound";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "@material-ui/core";
import { MyLocation as MyLocationIcon } from "@material-ui/icons";

import { parseFen, makeFen } from "chessops/fen";
import { Chess } from "chessops/chess";
import { parseUci, parseSquare } from "chessops/util";

import { ChessBoard } from "components/common";
import { Box, IconButton, Switch, Typography } from "components/material-ui";
import { useStateRef, useWindowSize } from "hooks";
import { useStockFishClient } from "lib/stock-fish";
import {
  getMatch,
  setCurrent as setCurrentMatch,
} from "redux/reducers/matchReducer";
import {
  addToMoveTree,
  findFromMoveTree,
  pvSanToPossibleMoves,
  updateScore,
} from "utils/common";
import { MoveTree, Progress } from "./components";
import { MoveTreeHeader, MoveTreeWrapper, PossibleMovesText } from "./styles";
import moveSound from "assets/sounds/move.mp3";
import capturedSound from "assets/sounds/captured.mp3";

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
  const [possibleMovesSan, setPossibleMovesSan] = useState("");
  const [pvSan, setPvSan] = useState("");
  const [currentScore, setCurrentScore] = useState(null);
  const [bestMove, setBestMove] = useState(null);
  const [ponder, setPonder] = useState(null);

  const [engineInProgress, setEngineInProgress] = useState(false);
  const [depth, setDepth] = useState(0);

  const [currentMoveId, setCurrentMoveId] = useState(null);
  const [moveVariation, setMoveVariation] = useState(null);

  const [chess, setChess, chessRef] = useStateRef(Chess.default());
  const chessContainerRef = createRef(null);
  const threatEnabledRef = useRef(threatEnabled);

  const { stockFishClient } = useStockFishClient();
  const SoundVolume = useMemo(() => 0.25, []);

  const [playMoveSound] = useSound(moveSound, { volume: SoundVolume });
  const [playCapturedSound] = useSound(capturedSound, { volume: SoundVolume });

  useEffect(() => {
    return () => {
      stockFishClient.stop();
    };
  }, [stockFishClient]);

  useEffect(() => {
    if (stockFishClient) {
      stockFishClient.on("score", onStockFishScore);
      stockFishClient.on("possible-moves-san", onStockFishPossibleMovesSan);
      stockFishClient.on("best-move", onStockFishBestMove);
      stockFishClient.on("depth", onStockFishDepth);
      stockFishClient.on("stopped", onStockFishStopped);
    }

    return () => {
      stockFishClient.off("score", onStockFishScore);
      stockFishClient.off("possible-moves-san", onStockFishPossibleMovesSan);
      stockFishClient.off("best-move", onStockFishBestMove);
      stockFishClient.off("depth", onStockFishDepth);
      stockFishClient.off("stopped", onStockFishStopped);
    };
    // eslint-disable-next-line
  }, [stockFishClient]);

  useEffect(() => {
    if (params.id) {
      dispatch(getMatch(params.id));
    }
    return () => {
      dispatch(setCurrentMatch(null));
    };
  }, [dispatch, params.id]);

  useEffect(() => {
    if (currentMatch) {
      let moveTree = moveVariation;
      let currentPlayerColor = playerColor;
      let moveId = currentMoveId;

      for (const move of currentMatch.moves) {
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        // const promotion = move.slice(4) || "x";

        const uciMove = parseUci(move);
        const normalizedMove = chessRef.current.normalizeMove(uciMove); //This is because chessops uses UCI_960

        if (chessRef.current.isLegal(normalizedMove)) {
          chessRef.current.play(normalizedMove);

          const fen = makeFen(chessRef.current.toSetup());

          const newMoveId = uuidv4();
          moveTree = addToMoveTree(moveTree, moveId, newMoveId, move, fen);

          setFen(fen);
          setLastMove([from, to]);

          currentPlayerColor = 1 - currentPlayerColor;
          moveId = newMoveId;
        }
      }

      setPlayerColor(currentPlayerColor);

      setMoveVariation(moveTree);
      setCurrentMoveId(moveId);
    }
    // eslint-disable-next-line
  }, [currentMatch]);

  useEffect(() => {
    if (stockFishEnabled && !engineInProgress) {
      const move = findFromMoveTree(moveVariation, currentMoveId);
      let fen = move ? move.fen : makeFen(chessRef.current.toSetup());
      let turn = chessRef.current.turn;

      if (threatEnabled) {
        const opTurn = turn === "white" ? "b" : "w";
        fen = fen.replace(
          /(?<PiecePlacement>((?<RankItem>[pnbrqkPNBRQK1-8]{1,8})\/?){8})\s+(?<SideToMove>b|w)/,
          `$<PiecePlacement> ${opTurn}`
        );
        turn = opTurn;
      }

      stockFishClient.go(fen, turn);
      setEngineInProgress(true);
    }
    // eslint-disable-next-line
  }, [currentMoveId, stockFishEnabled, engineInProgress, threatEnabled]);

  useEffect(() => {
    if (!stockFishEnabled || engineInProgress) {
      setCurrentScore(null);
      stockFishClient.stop();
    }
    // eslint-disable-next-line
  }, [currentMoveId, threatEnabled, stockFishEnabled]);

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

  useEffect(() => {
    threatEnabledRef.current = threatEnabled;
  }, [threatEnabled]);

  const handleMove = useCallback(
    (from, to, promot = "x") => {
      const move = promot === "x" ? from + to : from + to + promot;
      const uciMove = parseUci(move);
      const normalizedMove = chessRef.current.normalizeMove(uciMove); //This is because chessops uses UCI_960

      if (!chessRef.current.isLegal(normalizedMove)) return;
      chessRef.current.play(normalizedMove);
      const fen = makeFen(chessRef.current.toSetup());

      const toSquare = parseSquare(to);
      const piece = chessRef.current.board.get(toSquare);
      if (piece && piece.role) {
        playCapturedSound();
      } else {
        playMoveSound();
      }

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
    [currentMoveId, chessRef, moveVariation, playCapturedSound, playMoveSound]
  );

  const handleShowPast = useCallback(
    (moveId) => {
      setCurrentMoveId(moveId);

      const moveTree = findFromMoveTree(moveVariation, moveId);

      if (moveTree) {
        const setup = parseFen(moveTree.fen).unwrap();
        const pos = Chess.fromSetup(setup).unwrap();
        setChess(pos);

        setFen(moveTree.fen);
        const from = moveTree.move.slice(0, 2);
        const to = moveTree.move.slice(2, 4);
        setLastMove([from, to]);
        setPlayerColor(moveTree.level % 2);
      }
    },
    [moveVariation, setChess, setLastMove, setFen]
  );

  const toggleStockFishEnabled = () => {
    setStockFishEnabled((stockFishEnabled) => !stockFishEnabled);
  };

  const onStockFishScore = (score) => {
    setCurrentScore(score);
  };

  const onStockFishPossibleMovesSan = (pvSan) => {
    setPvSan(pvSan);
  };

  useEffect(() => {
    const move = findFromMoveTree(moveVariation, currentMoveId);

    setPossibleMovesSan(
      pvSanToPossibleMoves(
        pvSan,
        (move ? move.level : 0) + (threatEnabled ? 1 : 0)
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pvSan]);

  const onStockFishBestMove = ({ bestMove, engineStopped = true }) => {
    if (engineStopped) {
      setEngineInProgress(false);
    } else {
      if (threatEnabledRef.current) {
        setPonder(bestMove);
      } else {
        setBestMove(bestMove);
      }
    }
  };

  const onStockFishDepth = (depth) => {
    setDepth(depth);
  };

  const onStockFishStopped = () => {
    setEngineInProgress(false);
  };

  const toggleThreadEnabled = () => {
    setThreatEnabled((threatEnabled) => !threatEnabled);
  };

  const getShapes = useCallback(() => {
    const shapes = [];

    if (bestMove) {
      shapes.push({
        orig: bestMove.from,
        dest: bestMove.to,
        brush: "paleGreen",
        piece: undefined,
      });
    }

    if (ponder && threatEnabled) {
      shapes.push({
        orig: ponder.from,
        dest: ponder.to,
        brush: "red",
        piece: undefined,
      });
    }

    return shapes;
  }, [bestMove, ponder, threatEnabled]);

  return (
    <Box
      width="100%"
      minWidth="900px"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
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
          position="relative"
          overflow="hidden"
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
            disableOrientation
            animation={{
              enabled: true,
            }}
            drawable={{
              enabled: true,
              visible: true,
              defaultSnapToValidMove: true,
              autoShapes: getShapes(),
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
                <Typography variant="body2">
                  {depth ? `Depth ${depth} ` : ""}in local browser
                </Typography>
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
              <PossibleMovesText variant="body2">
                {possibleMovesSan}
              </PossibleMovesText>
            </Box>
          )}
          <Progress score={currentScore} />
          <Box height={chessBoardSize - 100} position="relative">
            <MoveTree
              moveTree={moveVariation}
              currentMoveId={currentMoveId}
              onShowPast={handleShowPast}
            />
          </Box>
        </MoveTreeWrapper>
      </Box>
    </Box>
  );
};
