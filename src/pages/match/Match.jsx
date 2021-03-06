import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import useSound from "use-sound";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import useInterval from "react-useinterval";
import { useHistory, useParams } from "react-router";
import { useTheme } from "@material-ui/core";
import {
  SignalCellular0Bar as SignalCellular0BarIcon,
  SignalCellular1Bar as SignalCellular1BarIcon,
  SignalCellular2Bar as SignalCellular2BarIcon,
  SignalCellular3Bar as SignalCellular3BarIcon,
  SignalCellular4Bar as SignalCellular4BarIcon,
} from "@material-ui/icons";

import { config } from "config";
import {
  GameEvents,
  GameStatus,
  GameActions,
  GameEndReason,
  GameEndReasonMessage,
  GameResults,
} from "constant";
import { LoadingScreen } from "components/common";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from "components/material-ui";
import { useStateRef, useValueRef, useWindowSize } from "hooks";
import { useJitsiClient } from "lib/jitsi";
// import { useZoomContext } from "lib/zoom";
// import { generateSignature, getValidUserName } from "lib/zoom/client/helpers";
import {
  addHistoryItem,
  setHistory,
  setCurrent as setCurrentMatch,
  getMatch,
} from "redux/reducers/matchReducer";
import { getTournament } from "redux/reducers/tournamentReducer";
import { getValidUserName } from "utils/common";
import { getAuthToken } from "utils/storage";
import GameClient from "utils/game-client";

import { parseFen, makeFen } from "chessops/fen";
import { Chess } from "chessops/chess";
import { parseUci, parseSquare } from "chessops/util";

import { ChessBoard } from "components/common";
import {
  Chat,
  Info,
  MoveList,
  Videos,
  Timer,
  MaterialCaptcha,
} from "./components";
import moveSound from "assets/sounds/move.mp3";
import startSound from "assets/sounds/start.mp3";
import lowtimeSound from "assets/sounds/lowtime.mp3";
import capturedSound from "assets/sounds/captured.mp3";
import { useStyles } from "./styles";
import { showError } from "redux/reducers/messageReducer";

export const Match = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const history = useHistory();

  const [chess, setChess, chessRef] = useStateRef(Chess.default());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [gameMessage, setGameMessage] = useState("");
  const [gameStatus, setGameStatus, gameStatusRef] = useStateRef(
    GameStatus.IDLE
  );
  const [clockActive, setClockActive, clockActiveRef] = useStateRef(false);
  const [alertedLowTime, setAlertedLowTime, alertedLowTimeRef] = useStateRef(
    false
  );
  const [players, setPlayers, playersRef] = useStateRef([]);
  // const [meetingJoining, setMeetingJoining] = useState(false);
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [askingDraw, setAskingDraw] = useState(false);
  const [whiteClock, setWhiteClock, whiteClockRef] = useStateRef(300);
  const [blackClock, setBlackClock, blackClockRef] = useStateRef(300);
  const [, setTurn, turnRef] = useStateRef(0);
  const [, setPremove, premoveRef] = useStateRef(null);
  const [usingVideo, setUsingVideo] = useState(true);
  const [pastMoveIndex, setPastMoveIndex] = useState(-1);
  const [legalMoves, setLegalMoves] = useState([]);
  const [latency, setLatency] = useState(0);

  const [currentMatch, currentMatchRef] = useValueRef(
    useSelector((state) => state.matchReducer.current)
  );
  const [actionHistory, historyRef] = useValueRef(
    useSelector((state) => state.matchReducer.history)
  );
  const user = useSelector((state) => state.authReducer.user);
  const [currentTournament, currentTournamentRef] = useValueRef(
    useSelector((state) => state.tournamentReducer.current)
  );

  const [isSpectator, isSpectatorRef] = useValueRef(
    useMemo(() => location.pathname.indexOf("/spectate") === 0, [location])
  );

  const isDirector = useMemo(
    () =>
      location.pathname.indexOf("/spectate") === 0 &&
      location.pathname.indexOf("/td") !== -1,
    [location]
  );

  const [playerColor, playerColorRef] = useValueRef(
    useMemo(
      () =>
        !user || !players.length || isSpectator
          ? 0
          : user.id === players[0].id
          ? 0 // white
          : 1, // black
      [user, players, isSpectator]
    )
  );

  const pieceDifference = useMemo(() => {
    const originalPieces = {
      king: 1,
      queen: 1,
      rook: 2,
      bishop: 2,
      knight: 2,
      pawn: 8,
    };
    let blackPieces = { ...originalPieces };
    let whitePieces = { ...originalPieces };

    for (let square of chess.board.white) {
      const piece = chess.board.get(square);
      if (piece && piece.role) whitePieces[piece.role]--;
    }
    for (let square of chess.board.black) {
      const piece = chess.board.get(square);
      if (piece && piece.role) blackPieces[piece.role]--;
    }

    let difference = {};
    for (let index of Object.keys(originalPieces)) {
      difference[index] = blackPieces[index] - whitePieces[index];
    }

    return difference;

    // eslint-disable-next-line
  }, [chess, actionHistory]);

  const gameClientRef = useRef(new GameClient(config.socketURL));
  // const zoomPreviewRef = useRef(null);
  // const zoomChatRef = useRef(null);
  // const userCountRef = useRef(1);
  const chessContainerRef = createRef(null);
  const chessgroundRef = useRef();
  const pingRef = useRef(null);
  const mountedRef = useRef(false);

  // const { zoomClient } = useZoomContext();
  const { jitsiClient } = useJitsiClient();

  const classes = useStyles();
  const theme = useTheme();
  const windowSize = useWindowSize();

  const SoundVolume = useMemo(() => 0.25, []);
  const LowTime = useMemo(() => 60, []);

  const [playMoveSound] = useSound(moveSound, { volume: SoundVolume });
  const [playStartSound] = useSound(startSound, { volume: SoundVolume });
  const [playLowtimeSound] = useSound(lowtimeSound, { volume: SoundVolume });
  const [playCapturedSound] = useSound(capturedSound, { volume: SoundVolume });
  const timestampRef = useRef(new Date().getTime());

  const handleOfferDraw = useCallback(() => {
    console.log("Offering Draw");
    gameClientRef.current.sendData({
      game: gameClientRef.current.gameId,
      action: GameActions.DRAWOFFER,
    });
  }, []);
  const handleRespondToDraw = useCallback(
    (accept = true) => {
      console.log("Responding to Draw: ", accept);
      gameClientRef.current.sendData({
        game: gameClientRef.current.gameId,
        action: GameActions.DRAWRESPONSE,
        accept: accept,
      });
      setAskingDraw(false);
    },
    [setAskingDraw]
  );

  const handleResign = useCallback(() => {
    gameClientRef.current.sendData({
      game: gameClientRef.current.gameId,
      action: GameActions.RESIGN,
    });
  }, []);

  const handleGoBack = useCallback(() => {
    dispatch(setHistory([]));
    dispatch(setCurrentMatch(null));
    if (currentTournament) {
      dispatch(getTournament(currentTournament.id));
      history.push(`/tournament/${currentTournament.id}`);
    } else {
      history.push(`/tournaments`);
    }
    // zoomClient.leaveMeeting();
    if (jitsiClient) {
      jitsiClient.leaveMeeting();
    }
  }, [dispatch, currentTournament, jitsiClient, history]);

  const handleShowPast = useCallback(
    (index) => {
      if (index === actionHistory.length - 1) {
        setPastMoveIndex(-1);
      } else {
        if (chessgroundRef.current && chessgroundRef.current.cg)
          chessgroundRef.current.cg.cancelPremove();
        setPremove(null);
        setPastMoveIndex(index);
      }
      setFen(actionHistory[index].fen);
      const from = actionHistory[index].content.slice(0, 2);
      const to = actionHistory[index].content.slice(2, 4);
      setLastMove([from, to]);
    },
    [actionHistory, setPastMoveIndex, setLastMove, setFen, setPremove]
  );

  //!!! From here, You should use Refs, not state!

  const onExitGame = useCallback(
    (game) => {
      console.log("onExitGame");
      const gameResult = game.result;
      const endReason = game.reason;
      if (gameResult && gameResult !== GameResults.ONGOING) {
        setGameStatus(GameStatus.EXITED);
        setClockActive(false);
        setWhiteClock(game.clocks[0].time / 1000);
        setBlackClock(game.clocks[1].time / 1000);

        if (gameResult === GameResults.DRAW) {
          setGameMessage(`Game drawn by ${GameEndReasonMessage[endReason]}`);
        } else {
          const winnerIndex = gameResult === GameResults.WHITE_WIN ? 0 : 1;
          const winner = currentMatchRef.current.players[winnerIndex].name;
          setGameMessage(`${winner} won by ${GameEndReasonMessage[endReason]}`);
        }
      }
    },
    [
      setGameMessage,
      setWhiteClock,
      setBlackClock,
      setGameStatus,
      currentMatchRef,
      setClockActive,
    ]
  );

  const onExitSpectating = useCallback(() => {
    gameClientRef.current.sendData({
      action: GameActions.STOPSPECTATE,
      game: gameClientRef.current.gameId,
    });
    setGameStatus(GameStatus.EXITED);
  }, [setGameStatus]);

  const addMoveStringToHistory = useCallback(
    (move, shouldPlay = true) => {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      // const e = move.slice(4) || "x";

      const uciMove = parseUci(move);
      const normalizedMove = chessRef.current.normalizeMove(uciMove); //This is because chessops uses UCI_960

      if (shouldPlay && chessRef.current.isLegal(normalizedMove)) {
        chessRef.current.play(normalizedMove);
        setFen(makeFen(chessRef.current.toSetup()));
      }

      dispatch(
        addHistoryItem({
          action: "move",
          content: move,
          fen: makeFen(chessRef.current.toSetup()),
        })
      );
      setLastMove([from, to]);
    },
    [dispatch, chessRef, setLastMove, setFen]
  );

  const initBoard = useCallback(
    (fen) => {
      const setup = parseFen(fen).unwrap();
      const pos = Chess.fromSetup(setup).unwrap();
      setChess(pos);
      setPastMoveIndex(-1);
      setFen(fen);
    },
    [setPastMoveIndex, setFen, setChess]
  );

  const handleMove = useCallback(
    (from, to, promot = "x") => {
      const moveString = promot === "x" ? from + to : from + to + promot;
      if (chessgroundRef.current && chessgroundRef.current.cg)
        chessgroundRef.current.cg.cancelPremove();
      setPremove(null);
      const uciMove = parseUci(moveString);
      const normalizedMove = chessRef.current.normalizeMove(uciMove); //This is because chessops uses UCI_960

      if (!chessRef.current.isLegal(normalizedMove)) return;

      const toSquare = parseSquare(to);
      const piece = chessRef.current.board.get(toSquare);
      if (piece && piece.role) {
        playCapturedSound();
      } else {
        playMoveSound();
      }
      chessRef.current.play(normalizedMove);

      dispatch(
        addHistoryItem({
          action: "move",
          content: moveString,
          fen: makeFen(chessRef.current.toSetup()),
        })
      );
      setFen(makeFen(chessRef.current.toSetup()));
      setLastMove([from, to]);
      setAskingDraw(false);
      gameClientRef.current.sendData({
        action: GameActions.MOVE,
        game: gameClientRef.current.gameId,
        move: moveString,
      });
    },
    [
      dispatch,
      chessRef,
      setFen,
      setLastMove,
      setAskingDraw,
      setPremove,
      playMoveSound,
      playCapturedSound,
    ]
  );

  const getResponse = useCallback(
    (data) => {
      if (data.game) {
        dispatch(setCurrentMatch(data.game));
        if (gameStatusRef.current !== GameStatus.EXITED)
          setGameStatus(GameStatus.PLAYING);
        if (!currentTournamentRef.current && data.game.tournament) {
          dispatch(getTournament(data.game.tournament.id));
        }
        if (
          data.game.reason >= GameEndReason.CHECKMATE &&
          data.game.reason <= GameEndReason.AGREEMENT
        )
          onExitGame(data.game);
        if (data.game.legalMoves) setLegalMoves(data.game.legalMoves);
        setTurn(data.game.turn);
        if (!playersRef.length && data.game.players.length > 1)
          setPlayers(data.game.players);
        if (data.game.clocks) {
          timestampRef.current = new Date().getTime();
          setWhiteClock(data.game.clocks[0].time / 1000);
          setBlackClock(data.game.clocks[1].time / 1000);

          setClockActive(
            data.game.clocks[0].active || data.game.clocks[1].active
          );
        }
        if (data.game.moves && data.game.moves.length > 0) {
          if (historyRef.current.length) {
            const move = data.game.moves[data.game.moves.length - 1];
            if (
              move &&
              (data.game.turn === playerColorRef.current ||
                isSpectatorRef.current)
            ) {
              // Opponent's move
              addMoveStringToHistory(move);
            }
          } else {
            if (data.game.settings && data.game.settings.startPos) {
              // Init Existing Board
              initBoard(data.game.settings.startPos);
            }
            for (let move of data.game.moves) {
              addMoveStringToHistory(move);
            }
          }
        } else if (data.game.fen) {
          // Init New Board
          initBoard(data.game.fen);
        }
        if (premoveRef.current && data.game.result === GameResults.ONGOING) {
          console.log("Premove: ", premoveRef.current);
          handleMove(premoveRef.current[0], premoveRef.current[1]);
        }
      }
    },
    [
      dispatch,
      initBoard,
      addMoveStringToHistory,
      setLegalMoves,
      setPlayers,
      setGameStatus,
      setWhiteClock,
      setBlackClock,
      setTurn,
      onExitGame,
      handleMove,
      gameStatusRef,
      historyRef,
      isSpectatorRef,
      playerColorRef,
      currentTournamentRef,
      playersRef,
      premoveRef,
      setClockActive,
    ]
  );
  const onOfferedDraw = useCallback(
    (colorBy) => {
      if (colorBy !== playerColorRef.current) {
        setAskingDraw(true);
      }
    },
    [setAskingDraw, playerColorRef]
  );
  const onOpenedSocket = useCallback(() => {
    const authToken = getAuthToken();
    if (!isSpectator && authToken) {
      console.log(
        "Opened Socket, authenticating with token: ",
        authToken.token
      );
      gameClientRef.current.sendData({
        action: GameActions.AUTH,
        token: authToken.token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onAuthenticatedSocket = useCallback(
    (data) => {
      console.log("Authenticated Socket: ", data);
      if (isSpectator) {
        if (!gameClientRef.current.gameId && !params.id) {
          return;
        }
        console.log("Spectating now", gameClientRef.current.id);
        gameClientRef.current.sendData({
          action: GameActions.JOIN,
          game: gameClientRef.current.gameId || params.id,
        });
      } else if (!data.user || !data.user.guest) {
        if (params.id) {
          console.log("Joining now");
          gameClientRef.current.sendData({
            action: GameActions.JOIN,
            game: gameClientRef.current.gameId || params.id,
          });
          setGameStatus(GameStatus.JOINING);
        } else {
          console.log("Seeking now");
          gameClientRef.current.sendData({
            action: GameActions.SEEK,
          });
          setGameStatus(GameStatus.SEEKING);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isSpectator, params, setGameStatus]
  );
  const onPong = useCallback((data) => {
    setLatency(new Date().getTime() - pingRef.current.getTime());
  }, []);
  const onError = useCallback(
    (data) => {
      dispatch(showError(data.error));
      handleGoBack();
    },
    [dispatch, handleGoBack]
  );

  const setUpHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.on(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.on(GameEvents.OPENED, onOpenedSocket);
      gameClientRef.current.on(GameEvents.AUTHENTICATED, onAuthenticatedSocket);
      gameClientRef.current.on(GameEvents.OFFEREDDRAW, onOfferedDraw);
      gameClientRef.current.on(GameEvents.EXITGAME, onExitGame);
      gameClientRef.current.on(GameEvents.PONG, onPong);
      gameClientRef.current.on(GameEvents.ERROR, onError);
    }
    if (isSpectator) {
      window.addEventListener("unload", onExitSpectating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getResponse,
    onOpenedSocket,
    onAuthenticatedSocket,
    onOfferedDraw,
    onExitGame,
    isSpectator,
    onExitSpectating,
    onPong,
  ]);

  const endHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.off(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.off(GameEvents.OPENED, onOpenedSocket);
      gameClientRef.current.off(
        GameEvents.AUTHENTICATED,
        onAuthenticatedSocket
      );
      gameClientRef.current.off(GameEvents.OFFEREDDRAW, onOfferedDraw);
      gameClientRef.current.off(GameEvents.EXITGAME, onExitGame);
      gameClientRef.current.off(GameEvents.PONG, onPong);
      gameClientRef.current.off(GameEvents.ERROR, onError);
    }
    if (isSpectator) {
      window.removeEventListener("unload", onExitSpectating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getResponse,
    onOpenedSocket,
    onAuthenticatedSocket,
    onOfferedDraw,
    onExitGame,
    isSpectator,
    onExitSpectating,
    onPong,
  ]);

  //!!! End of Listeners, you can now use states!

  // useEffect(() => {
  //   if (params.id && !currentMatch) {
  //     dispatch(getMatch(params.id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // const joinMeeting = async (id, password, userName, email) => {
    //   const meetingNumber = id;
    //   const passWord = password;

    //   const signature = await generateSignature(
    //     meetingNumber,
    //     config.zoom.apiKey,
    //     config.zoom.apiSecret
    //   );

    //   zoomClient.setUserData({
    //     userName: userName,
    //     userEmail: email,
    //   });

    //   zoomClient.on("onUserJoin", (data) => {
    //     console.log(`## Zoom SDK ## - User ${data.userId} joined`);
    //   });

    //   zoomClient.on("joinClicked", () => {
    //     setMeetingJoining(false);
    //     userCountRef.current = 1;
    //   });

    //   await zoomClient.joinMeeting(
    //     {
    //       meetingNumber,
    //       passWord,
    //       signature,
    //       leaveUrl: currentTournament
    //         ? `/tournament/${currentTournament.id}`
    //         : "/tournaments",
    //     },
    //     {
    //       chatDOM: zoomChatRef.current,
    //       previewDOM: zoomPreviewRef.current,
    //       title: "Start Game",
    //       joinButtonText: "Start",
    //       autoJoin: isDirector,
    //     }
    //   );

    //   zoomClient.renderUserVideo();
    // };

    if (isSpectator && !currentMatch && params.id) {
      dispatch(getMatch(params.id));
    } else if (
      (!isSpectator || isDirector) &&
      gameStatus === GameStatus.PLAYING &&
      currentMatch &&
      currentMatch.meeting
    ) {
      // setMeetingJoining(true);

      // joinMeeting(
      //   currentMatch.meeting.id,
      //   currentMatch.meeting.password,
      //   isDirector
      //     ? `${user.name || user.username}(Tournament Director)`
      //     : getValidUserName(currentMatch, user.id, user.name || user.username),
      //   user.email
      // );

      if (jitsiClient) {
        jitsiClient.initialize(() => {
          if (mountedRef.current) {
            jitsiClient.joinMeeting({
              meetingId: currentMatch.meeting.id,
              userName: isDirector
                ? `${user.name || user.username}(Tournament Director)`
                : getValidUserName(
                    currentMatch,
                    user.id,
                    user.name || user.username
                  ),
              settings: {
                audio: true,
                video: isDirector ? false : true,
              },
            });
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize, chessContainerRef]);

  useEffect(() => {
    if (usingVideo) {
      // zoomClient.enableCustomRendering();
      // zoomClient.renderUserVideo();
    } else {
      // zoomClient.disableCustomRendering();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingVideo]);

  useEffect(() => {
    gameClientRef.current = new GameClient(config.socketURL);
    gameClientRef.current.connect();
    setUpHandlers();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gameClientRef.current.disconnect();
      endHandlers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useInterval(
  //   () => {
  //     if (turn === 0) setWhiteClock((clock) => clock - 0.1);
  //     else setBlackClock((clock) => clock - 0.1);
  //   },
  //   gameStatus === GameStatus.PLAYING ? 100 : null
  // );
  useEffect(() => {
    if (clockActive) {
      playStartSound();
    }
    // eslint-disable-next-line
  }, [clockActive]);
  useEffect(() => {
    if (alertedLowTime) {
      playLowtimeSound();
    }
    // eslint-disable-next-line
  }, [alertedLowTime]);

  useEffect(() => {
    const clockHandler = setInterval(() => {
      if (clockActiveRef.current) {
        const newTimestamp = new Date().getTime();
        const dur = (newTimestamp - timestampRef.current) / 1000;
        timestampRef.current = newTimestamp;

        if (turnRef.current === 0) {
          setWhiteClock((clock) => Math.max(0, clock - dur));
          if (
            playerColorRef.current === 0 &&
            whiteClockRef.current <= LowTime &&
            !alertedLowTimeRef.current
          ) {
            setAlertedLowTime(true);
          }
        } else {
          setBlackClock((clock) => Math.max(0, clock - dur));
          if (
            playerColorRef.current === 1 &&
            blackClockRef.current <= LowTime &&
            !alertedLowTimeRef.current
          ) {
            setAlertedLowTime(true);
          }
        }
      }
    }, 100);

    return () => {
      clearInterval(clockHandler);
    };
    // eslint-disable-next-line
  }, []);

  // Interval for Ping-Pong ;)
  useInterval(
    () => {
      if (gameStatus !== GameStatus.EXITED) {
        console.log(gameStatus);
        gameClientRef.current.sendData({
          action: GameActions.PING,
        });
        pingRef.current = new Date();
      }
    },
    gameStatus !== GameStatus.EXITED ? 10000 : null
  );

  const handleToggleUsingVideo = () => {
    setUsingVideo((usingVideo) => !usingVideo);
  };

  if (!currentMatch)
    return (
      <LoadingScreen>
        <Box ml={3}>
          <Typography variant="h3">
            {isSpectator
              ? "Waiting"
              : gameStatus === GameStatus.IDLE
              ? "Connecting to the server"
              : gameStatus === GameStatus.SEEKING
              ? "Finding a match"
              : gameStatus === GameStatus.JOINING
              ? "Joining a match"
              : gameStatus === GameStatus.EXITED
              ? "Redirecting"
              : "Error connecting to the server. Returing to tournament page"}
            ...
          </Typography>
        </Box>
      </LoadingScreen>
    );

  const LatencyIcon =
    latency < 100
      ? SignalCellular4BarIcon
      : latency < 200
      ? SignalCellular3BarIcon
      : latency < 300
      ? SignalCellular2BarIcon
      : latency < 400
      ? SignalCellular1BarIcon
      : SignalCellular0BarIcon;

  return (
    <Grid container spacing={5} p={5} className={classes.wrapper}>
      <Box
        component={Grid}
        item
        sm={3}
        md={3}
        display={{ xs: "none", sm: "block" }}
      >
        <Box display="flex" flexDirection="column" height="calc(100vh - 40px)">
          <Paper p={5}>
            <Info match={currentMatch} playerColor={playerColor} />
            <Box my={2}>
              <Divider />
            </Box>
            <Chat message={gameMessage} />
            {/* <Box className={classes.zoomChatWrapper} ref={zoomChatRef} /> */}
          </Paper>
          <Box flexGrow={1} mt={5} height={`calc(100% - 718px)`}>
            <MoveList
              playerColor={playerColor}
              gameStatus={gameStatus}
              isSpectator={isSpectator}
              moveList={actionHistory}
              askingDraw={askingDraw}
              pastMoveIndex={pastMoveIndex}
              onOfferDraw={handleOfferDraw}
              onResign={handleResign}
              onShowPast={handleShowPast}
              onAcceptDraw={() => handleRespondToDraw(true)}
              onDeclineDraw={() => handleRespondToDraw(false)}
              onExitSpectating={onExitSpectating}
            />
          </Box>
        </Box>
      </Box>
      <Box component={Grid} item xs={12} sm={9} md={6}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          minWidth="400px"
          p={5}
          bgcolor={theme.palette.background.paper}
          borderRadius={8}
        >
          <Box
            width="100%"
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <Typography variant="body2" mr={2}>
              Latency: {latency}ms
            </Typography>
            <LatencyIcon size="small" />
          </Box>
          <Timer
            name={
              playerColor
                ? currentMatch.players[0].name
                : currentMatch.players[1].name
            }
            rating={
              playerColor
                ? currentMatch.players[0].rating
                : currentMatch.players[1].rating
            }
            clock={playerColor ? whiteClock : blackClock}
          />
          <MaterialCaptcha
            pieceDifference={pieceDifference}
            color={1 - playerColor}
          />
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
              chessgroundRef={chessgroundRef}
              fen={fen}
              inPast={pastMoveIndex !== -1}
              playerColor={playerColor}
              isSpectator={isSpectator}
              lastMove={lastMove}
              isPlaying={gameStatus === GameStatus.PLAYING}
              legalMoves={legalMoves}
              setPremove={setPremove}
              onMove={handleMove}
            />
          </Box>
          <MaterialCaptcha
            pieceDifference={pieceDifference}
            color={playerColor}
          />
          <Timer
            name={
              playerColor
                ? currentMatch.players[1].name
                : currentMatch.players[0].name
            }
            rating={
              playerColor
                ? currentMatch.players[1].rating
                : currentMatch.players[0].rating
            }
            clock={playerColor ? blackClock : whiteClock}
          />
        </Box>
      </Box>
      <Box
        component={Grid}
        item
        md={3}
        display={{ xs: "none", sm: "none", md: "block" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          height="100%"
        >
          {gameStatus === GameStatus.EXITED ? (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleGoBack}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h4" component="p">
                  Go to lobby
                </Typography>
                {currentMatch.tournament &&
                currentMatch.tournament.round <
                  currentTournament.settings.numRounds - 1 ? (
                  <Typography variant="h6" component="p">
                    Next round starts in 5:00 mins
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
            </Button>
          ) : (
            <></>
          )}
          <Videos
            match={currentMatch}
            playerColor={playerColor}
            usingVideo={usingVideo}
            onToggleUsingVideo={handleToggleUsingVideo}
          />
        </Box>
      </Box>
    </Grid>
  );
};
