import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core";

import { config } from "config";
import { GameEvents, GameStatus, GameActions } from "constant";
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
import { useZoomContext } from "lib/zoom";
import { generateSignature } from "lib/zoom/client/helpers";
import { addHistoryItem } from "redux/reducers/matchReducer";
import { getAuthToken } from "utils/storage";
import GameClient from "utils/gameClient";
import {
  Chat,
  ChessBoard,
  Info,
  MoveList,
  Scoreboard,
  Timer,
} from "./components";
import { useStyles } from "./styles";

const Match = () => {
  const dispatch = useDispatch();

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [pendingMove, setPendingMove] = useState();
  const [gameStatus, setGameStatus] = useState(GameStatus.IDLE);
  const [players, setPlayers] = useState([]);
  const [meetingJoining, setMeetingJoining] = useState(false);
  const [chessBoardSize, setChessBoardSize] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(null);

  // const currentMatch = useSelector((state) => state.matchReducer.current);
  const actionHistory = useSelector((state) => state.matchReducer.history);
  const user = useSelector((state) => state.authReducer.user);

  const gameClientRef = useRef(new GameClient(config.socketURL));
  const zoomPreviewRef = useRef(null);
  const userCountRef = useRef(1);
  const chessContainerRef = useRef(null);
  const historyRef = useRef(actionHistory);

  const playerColor = useMemo(
    () => (!user || !players.length ? 0 : user.id === players[0].id ? 0 : 1),
    [user, players]
  );

  const { zoomClient } = useZoomContext();
  const classes = useStyles();
  const theme = useTheme();
  const windowSize = useWindowSize();

  const handleOfferDraw = useCallback(() => {
    console.log("Offering Draw");
    gameClientRef.current.sendData({
      action: GameActions.DRAWOFFER,
    });
  }, []);

  const handleResign = useCallback(() => {
    gameClientRef.current.sendData({
      action: GameActions.RESIGN,
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
        dispatch(addHistoryItem({ action: "move", content: chessMove }));
        setLastMove([from, to]);
      }
    },
    [dispatch, chess, setLastMove]
  );

  const getResponse = useCallback(
    (data) => {
      if (data.game) {
        if (data.state === GameStatus.PLAYING) {
          setCurrentMatch(data.game);
          setGameStatus(GameStatus.PLAYING);
        }
        if (!players.length && data.game.players.length > 1)
          setPlayers(data.game.players);
        if (data.game.moves && data.game.moves.length > 0) {
          console.log("Checking history: ", historyRef.current);
          if (historyRef.current.length) {
            const move = data.game.moves[data.game.moves.length - 1];
            if (move) {
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
          setFen(data.game.fen);
        }
      }
    },
    [addMoveStringToHistory, setFen, players, setPlayers, setGameStatus]
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

  // useEffect(() => {
  //   if (params.id && !currentMatch) {
  //     dispatch(getMatch(params.id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  useEffect(() => {
    const joinMeeting = async ({ id, password }) => {
      const meetingNumber = id;
      const passWord = password;

      const signature = await generateSignature(
        meetingNumber,
        config.zoom.apiKey,
        config.zoom.apiSecret
      );

      zoomClient.setUserData({
        userName: user.id,
        userEmail: user.email,
      });

      zoomClient.on("onUserJoin", (data) => {
        setTimeout(() => {
          const userName = zoomClient.getUserName(data.userId);
          const userVideoCanvas = document.getElementById(`${userName}-video`);

          if (userVideoCanvas) {
            zoomClient.renderUserVideo(data.userId, userVideoCanvas);
          }
        }, 5000);
      });

      zoomClient.on("joinClicked", () => {
        setMeetingJoining(false);
        userCountRef.current = 1;
      });

      await zoomClient.joinMeeting(
        {
          meetingNumber,
          passWord,
          signature,
          leaveUrl: "/tournament/0",
        },
        {
          previewDOM: zoomPreviewRef.current,
          title: "Start Game",
          joinButtonText: "Start",
        }
      );
    };

    if (
      gameStatus === GameStatus.PLAYING &&
      currentMatch &&
      currentMatch.meeting
    ) {
      setMeetingJoining(true);
      joinMeeting(currentMatch.meeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize]);

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
    historyRef.current = actionHistory;
  }, [actionHistory]);

  if (!currentMatch)
    return (
      <LoadingScreen>
        <Box ml={3}>
          <Typography variant="h3">
            {gameStatus === GameStatus.IDLE
              ? "Connecting to the server"
              : gameStatus === GameStatus.SEEKING
              ? "Finding a match"
              : "Error connecting to the server. Returing to tournament page"}
            ...
          </Typography>
        </Box>
      </LoadingScreen>
    );

  return (
    <Grid container spacing={5} p={5} className={classes.wrapper}>
      <Grid item md={3} sm={2}>
        <Box display="flex" flexDirection="column" height="100%">
          <Paper p={5}>
            <Info match={currentMatch} />
            <Box my={3}>
              <Divider />
            </Box>
            <Chat />
          </Paper>
          <Box flexGrow={1} mt={5}>
            <MoveList
              moveList={actionHistory}
              onOfferDraw={handleOfferDraw}
              onResign={handleResign}
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
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            ref={chessContainerRef}
          >
            <ChessBoard
              width={chessBoardSize}
              height={chessBoardSize}
              chess={chess}
              fen={fen}
              playerColor={playerColor}
              actionHistory={actionHistory}
              gameClientRef={gameClientRef}
              lastMove={lastMove}
              pendingMove={pendingMove}
              gameStatus={gameStatus}
              players={players}
              user={user}
              setFen={setFen}
              setLastMove={setLastMove}
              setPendingMove={setPendingMove}
              setGameStatus={setGameStatus}
              setPlayers={setPlayers}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Box width="50%">
              <Scoreboard match={currentMatch} score={{ black: 0, white: 0 }} />
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={3} sm={2}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          {false ? (
            <Button variant="contained" color="secondary" size="large">
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
            <Button></Button>
          )}
          <Timer match={currentMatch} />
        </Box>
      </Grid>
      <Box
        display={meetingJoining ? "flex" : "none"}
        alignItems="center"
        justifyContent="center"
        ref={zoomPreviewRef}
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        right={0}
        bgcolor={theme.palette.background.paper}
        zIndex={3}
      />
    </Grid>
  );
};

export default Match;
