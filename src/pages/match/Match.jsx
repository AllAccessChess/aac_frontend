import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import useInterval from "react-useinterval";
import { useHistory, useParams } from "react-router";
import { useTheme } from "@material-ui/core";

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
import { useWindowSize } from "hooks";
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
import { ChessBoard } from "components/common";
import { Chat, Info, MoveList, Videos, Timer } from "./components";
import { useStyles } from "./styles";

export const Match = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const history = useHistory();

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [gameMessage, setGameMessage] = useState("");
  const [gameStatus, setGameStatus] = useState(GameStatus.IDLE);
  const [clockActive, setClockActive] = useState(false);
  const [players, setPlayers] = useState([]);
  // const [meetingJoining, setMeetingJoining] = useState(false);
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [askingDraw, setAskingDraw] = useState(false);
  const [whiteClock, setWhiteClock] = useState(300);
  const [blackClock, setBlackClock] = useState(300);
  const [turn, setTurn] = useState(0);
  const [premove, setPremove] = useState(null);
  const [usingVideo, setUsingVideo] = useState(true);
  const [pastMoveIndex, setPastMoveIndex] = useState(-1);

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const actionHistory = useSelector((state) => state.matchReducer.history);
  const user = useSelector((state) => state.authReducer.user);
  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );

  const isSpectator = useMemo(
    () => location.pathname.indexOf("/spectate") === 0,
    [location]
  );

  const isDirector = useMemo(
    () =>
      location.pathname.indexOf("/spectate") === 0 &&
      location.pathname.indexOf("/td") !== -1,
    [location]
  );

  const playerColor = useMemo(
    () =>
      !user || !players.length || isSpectator
        ? 0
        : user.id === players[0].id
        ? 0 // white
        : 1, // black
    [user, players, isSpectator]
  );

  const pieceDifference = useMemo(() => {
    const originalPieces = {
      k: 1,
      q: 1,
      r: 2,
      b: 2,
      n: 2,
      p: 8,
    };
    let blackPieces = { ...originalPieces };
    let whitePieces = { ...originalPieces };
    const board = chess.board();
    for (let line of board) {
      for (let piece of line) {
        if (piece && piece.color === "b") blackPieces[piece.type]--;
        if (piece && piece.color === "w") whitePieces[piece.type]--;
      }
    }
    let difference = {};
    for (let index of Object.keys(originalPieces)) {
      difference[index] = whitePieces[index] - blackPieces[index];
    }
    console.log(difference);
    return difference;

    // eslint-disable-next-line
  }, [chess, actionHistory]);

  const gameClientRef = useRef(new GameClient(config.socketURL));
  // const zoomPreviewRef = useRef(null);
  // const zoomChatRef = useRef(null);
  // const userCountRef = useRef(1);
  const chessContainerRef = createRef(null);
  const historyRef = useRef(actionHistory);
  const playersRef = useRef(players);
  const playerColorRef = useRef(playerColor);
  const isSpectatorRef = useRef(isSpectator);
  const premoveRef = useRef(premove);
  const currentMatchRef = useRef(currentMatch);
  const turnRef = useRef(turn);
  const clockActiveRef = useRef(clockActive);

  // const { zoomClient } = useZoomContext();
  const { jitsiClient } = useJitsiClient();

  const classes = useStyles();
  const theme = useTheme();
  const windowSize = useWindowSize();

  const handleOfferDraw = useCallback(() => {
    console.log("Offering Draw");
    gameClientRef.current.sendData({
      action: GameActions.DRAWOFFER,
    });
  }, []);
  const handleRespondToDraw = useCallback(
    (accept = true) => {
      console.log("Responding to Draw: ", accept);
      gameClientRef.current.sendData({
        action: GameActions.DRAWRESPONSE,
        accept: accept,
      });
      setAskingDraw(false);
    },
    [setAskingDraw]
  );

  const handleResign = useCallback(() => {
    gameClientRef.current.sendData({
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
        setPastMoveIndex(index);
      }
      setFen(actionHistory[index].fen);
      setLastMove([
        actionHistory[index].content.from,
        actionHistory[index].content.to,
      ]);
    },
    [actionHistory, setPastMoveIndex, setLastMove, setFen]
  );

  //!!! From here, You should use Refs, not state!

  const onExitGame = useCallback(
    (game) => {
      const gameResult = game.result;
      const endReason = game.reason;
      if (gameResult && gameResult !== GameResults.ONGOING) {
        setGameStatus(GameStatus.EXITED);

        if (gameResult === GameResults.DRAW) {
          setGameMessage(`Game drawn by ${GameEndReasonMessage[endReason]}`);
        } else {
          const winnerIndex = gameResult === GameResults.WHITE_WIN ? 0 : 1;
          const winner = currentMatchRef.current.players[winnerIndex].name;
          setGameMessage(`${winner} won by ${GameEndReasonMessage[endReason]}`);
        }
      }
    },
    [setGameMessage, setGameStatus]
  );

  const onExitSpectating = useCallback(() => {
    gameClientRef.current.sendData({
      action: GameActions.STOPSPECTATE,
      game: gameClientRef.current.gameId,
    });
    setGameStatus(GameStatus.EXITED);
  }, [setGameStatus]);

  const addMoveStringToHistory = useCallback(
    (move) => {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      const e = move.slice(4) || "x";

      const chessMove = chess.move({ from, to, promotion: e });
      console.log("chessMove: ", chessMove);
      if (chessMove) {
        dispatch(
          addHistoryItem({
            action: "move",
            content: chessMove,
            fen: chess.fen(),
          })
        );
        setLastMove([from, to]);
      }
    },
    [dispatch, chess, setLastMove]
  );

  const handleMove = useCallback(
    (from, to, promot = "x") => {
      const move = chess.move({ from, to, promotion: promot });
      if (!move) return;
      dispatch(
        addHistoryItem({ action: "move", content: move, fen: chess.fen() })
      );
      setFen(chess.fen());
      setLastMove([from, to]);
      setAskingDraw(false);
      gameClientRef.current.sendData({
        action: GameActions.MOVE,
        game: gameClientRef.current.gameId,
        move: promot === "x" ? from + to : from + to + promot,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, chess, setFen, setLastMove, setPremove]
  );

  const getResponse = useCallback(
    (data) => {
      if (data.game) {
        if (data.state === GameStatus.PLAYING) {
          dispatch(setCurrentMatch(data.game));
          setGameStatus(GameStatus.PLAYING);
        }
        if (
          data.game.reason >= GameEndReason.CHECKMATE &&
          data.game.reason <= GameEndReason.AGREEMENT
        )
          onExitGame(data.game);
        setTurn(data.game.turn);
        if (!playersRef.length && data.game.players.length > 1)
          setPlayers(data.game.players);
        if (data.game.clocks) {
          setWhiteClock(data.game.clocks[0].time / 1000);
          setBlackClock(data.game.clocks[1].time / 1000);

          setClockActive(
            data.game.clocks[0].active || data.game.clocks[1].active
          );
        }
        if (data.game.moves && data.game.moves.length > 0) {
          console.log("Checking history: ", historyRef.current);
          if (historyRef.current.length) {
            const move = data.game.moves[data.game.moves.length - 1];
            if (
              move &&
              (data.game.turn === playerColorRef.current ||
                isSpectatorRef.current)
            ) {
              console.log("Opponent's move: ", move);
              addMoveStringToHistory(move);
            }
          } else {
            console.log("Loading Previous Match: ", data.game.moves);
            for (let move of data.game.moves) {
              addMoveStringToHistory(move);
            }
          }
        }
        if (data.game.fen) {
          console.log("***Setting Fen!");
          setPastMoveIndex(-1);
          setFen(data.game.fen);
          chess.load(data.game.fen);
        }
        if (premoveRef.current) {
          handleMove(premoveRef.current[0], premoveRef.current[1]);
        }
      }
    },
    [
      dispatch,
      chess,
      addMoveStringToHistory,
      setFen,
      setPastMoveIndex,
      setPlayers,
      setGameStatus,
      setWhiteClock,
      setBlackClock,
      setTurn,
      onExitGame,
      handleMove,
    ]
  );
  const onOfferedDraw = useCallback(
    (colorBy) => {
      console.log(colorBy, " offered Draw");
      if (colorBy !== playerColorRef.current) {
        setAskingDraw(true);
      }
    },
    [setAskingDraw]
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
      if (data.state === GameStatus.PLAYING) {
        setGameStatus(GameStatus.PLAYING);
        chess.load(data.game.fen);
        setFen(data.game.fen);
      } else if (isSpectator) {
        if (!currentMatchRef.current) {
          return;
        }
        console.log("Spectating now", currentMatchRef.current.id);
        gameClientRef.current.sendData({
          action: GameActions.SPECTATE,
          game: currentMatchRef.current.id,
        });
      } else {
        if (params.id) {
          console.log("Joining now");
          gameClientRef.current.sendData({
            action: GameActions.JOIN,
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
    [isSpectator, params, setFen, chess]
  );

  const setUpHandlers = useCallback(() => {
    if (gameClientRef.current) {
      gameClientRef.current.on(GameEvents.GET_RESPONSE, getResponse);
      gameClientRef.current.on(GameEvents.OPENED, onOpenedSocket);
      gameClientRef.current.on(GameEvents.AUTHENTICATED, onAuthenticatedSocket);
      gameClientRef.current.on(GameEvents.OFFEREDDRAW, onOfferedDraw);
      gameClientRef.current.on(GameEvents.EXITGAME, onExitGame);
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
  ]);

  //!!! End of Listeners, you can now use states!

  // useEffect(() => {
  //   if (params.id && !currentMatch) {
  //     dispatch(getMatch(params.id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

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
        jitsiClient.joinMeeting({
          meetingId: currentMatch.meeting.id,
          userName: isDirector
            ? `${user.name || user.username}(Tournament Director)`
            : getValidUserName(
                currentMatch,
                user.id,
                user.name || user.username
              ),
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
    turnRef.current = turn;
  }, [turn]);

  useEffect(() => {
    clockActiveRef.current = clockActive;
  }, [clockActive]);

  useEffect(() => {
    const worker = new Worker("/clock.js");

    const clockHandler = () => {
      if (clockActiveRef.current) {
        if (turnRef.current === 0) {
          setWhiteClock((clock) => clock - 0.1);
        } else {
          setBlackClock((clock) => clock - 0.1);
        }
      }
    };

    worker.onmessage = clockHandler;

    return () => {
      worker.terminate();
    };
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

  // Setting Refs on Change of States
  useEffect(() => {
    historyRef.current = actionHistory;
  }, [actionHistory]);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    playerColorRef.current = playerColor;
  }, [playerColor]);
  useEffect(() => {
    isSpectatorRef.current = isSpectator;
  }, [isSpectator]);
  useEffect(() => {
    premoveRef.current = premove;
  }, [premove]);
  useEffect(() => {
    currentMatchRef.current = currentMatch;
  }, [currentMatch]);

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

  return (
    <Grid container spacing={5} p={5} className={classes.wrapper}>
      <Grid item md={3} sm={2}>
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
      </Grid>
      <Grid item md={6} sm={8}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          p={5}
          bgcolor={theme.palette.background.paper}
          borderRadius={8}
        >
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
              inPast={pastMoveIndex !== -1}
              playerColor={playerColor}
              isSpectator={isSpectator}
              lastMove={lastMove}
              isPlaying={gameStatus === GameStatus.PLAYING}
              premove={premove}
              setPremove={setPremove}
              onMove={handleMove}
            />
          </Box>
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
      </Grid>
      <Grid item md={3} sm={2}>
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
                <Typography variant="h6" component="p">
                  Next round starts in 5:00 mins
                </Typography>
              </Box>
            </Button>
          ) : (
            <></>
          )}
          <Videos
            match={currentMatch}
            playerColor={playerColor}
            pieceDifference={pieceDifference}
            usingVideo={usingVideo}
            onToggleUsingVideo={handleToggleUsingVideo}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
