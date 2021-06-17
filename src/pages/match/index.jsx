import React, { useCallback, useEffect, useRef, useState } from "react";
import Chess from "chess.js";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core";

import { config } from "config";
import { GameStatus, GameActions } from "constant";
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
import { getMatch } from "redux/reducers/matchReducer";
import { isMatchOwner } from "utils/common";
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
  const params = useParams();
  const dispatch = useDispatch();
  const gameClientRef = useRef(new GameClient(config.socketURL));

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [pendingMove, setPendingMove] = useState();
  const [gameStatus, setGameStatus] = useState(GameStatus.Preparing);
  const [meetingJoining, setMeetingJoining] = useState(false);
  const [chessBoardSize, setChessBoardSize] = useState(0);

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const history = useSelector((state) => state.matchReducer.history);
  const user = useSelector((state) => state.authReducer.user);

  const zoomPreviewRef = useRef(null);
  const userCountRef = useRef(1);
  const chessContainerRef = useRef(null);

  const { zoomClient } = useZoomContext();
  const classes = useStyles();
  const theme = useTheme();
  const windowSize = useWindowSize();

  const handleOfferDraw = useCallback(() => {
    console.log("Offering Draw");
  }, []);

  const handleResign = useCallback(() => {
    gameClientRef.current.sendData({
      action: GameActions.resign,
    });
    setGameStatus(GameStatus.Exited);
  }, [setGameStatus]);

  const startGame = useCallback(() => {
    setGameStatus(GameStatus.Started);
  }, [setGameStatus]);

  useEffect(() => {
    if (params.id && !currentMatch) {
      dispatch(getMatch(params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const joinMeeting = async () => {
      const meetingNumber = 8263378970;
      const passWord = "5j3UnA";

      const signature = await generateSignature(
        meetingNumber,
        config.zoom.apiKey,
        config.zoom.apiSecret
      );

      zoomClient.setUserData({
        userName: user.username,
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
        startGame();
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
          title: "Start Video Call",
          joinButtonText: "Start",
        }
      );
    };

    if (isMatchOwner(currentMatch, user)) {
      setMeetingJoining(true);
      joinMeeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatch]);

  useEffect(() => {
    if (chessContainerRef.current) {
      const boundingRect = chessContainerRef.current.getBoundingClientRect();
      setChessBoardSize(Math.min(boundingRect.width, boundingRect.height) - 30);
    }
  }, [windowSize]);

  if (!currentMatch) return <LoadingScreen />;
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
            <MoveList moveList={history} />
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
              gameClientRef={gameClientRef}
              lastMove={lastMove}
              pendingMove={pendingMove}
              gameStatus={gameStatus}
              setFen={setFen}
              setLastMove={setLastMove}
              setPendingMove={setPendingMove}
              setGameStatus={setGameStatus}
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
