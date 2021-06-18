import React, { useCallback, useEffect, useRef, useState } from "react";
import Chess from "chess.js";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AccessTime as AccessTimeIcon } from "@material-ui/icons";

import { config } from "config";
import { GameStatus, GameActions } from "constant";
import { LoadingScreen } from "components/common";
import { Box, Divider, Grid, Paper, Typography } from "components/material-ui";
import { useZoomContext } from "lib/zoom";
import { generateSignature } from "lib/zoom/client/helpers";
import { getMatch } from "redux/reducers/matchReducer";
import GameClient from "utils/gameClient";
import { Chat, ChessBoard, Info, MoveList } from "./components";
import { useStyles } from "./styles";

const Match = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const gameClientRef = useRef(new GameClient(config.socketURL));

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [pendingMove, setPendingMove] = useState();
  const [gameStatus, setGameStatus] = useState(GameStatus.PREPARING);
  const [players, setPlayers] = useState([]);
  const [meetingJoining, setMeetingJoining] = useState(false);

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const history = useSelector((state) => state.matchReducer.history);
  const user = useSelector((state) => state.authReducer.user);

  const { zoomClient } = useZoomContext();
  const zoomPreviewRef = useRef(null);
  const userCountRef = useRef(1);
  const classes = useStyles();

  const handleOfferDraw = useCallback(() => {
    console.log("Offering Draw");
  }, []);

  const handleResign = useCallback(() => {
    gameClientRef.current.sendData({
      action: GameActions.RESIGN,
    });
    setGameStatus(GameStatus.EXITED);
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

    if (currentMatch && user && user.username) {
      setMeetingJoining(true);
      joinMeeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatch]);

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
            <MoveList
              moveList={history}
              onOfferDraw={handleOfferDraw}
              onResign={handleResign}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item md={6} sm={8}>
        <Box display="flex" flexDirection="column" height="100%">
          <Paper p={5}>
            <ChessBoard
              width="30vw"
              height="30vw"
              chess={chess}
              fen={fen}
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
          </Paper>
        </Box>
      </Grid>
      <Grid item md={3} sm={2}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          height="80%"
          width={240}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <canvas
              width={192}
              height={120}
              id={`${currentMatch.black.username}-video`}
              style={{
                borderRadius: 8,
                background: "black",
                transform: "scaleX(-1)",
              }}
            ></canvas>
            <Box my={2}>
              <Typography variant="h6">
                {currentMatch.black.name}(
                {currentMatch.black.ratings.uscf.ratings.blitz.rating})
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="#134378"
              width="100%"
              py={2}
              borderRadius={8}
            >
              <AccessTimeIcon />
              <Typography>10:00</Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="#134378"
              width="100%"
              py={2}
              borderRadius={8}
            >
              <AccessTimeIcon />
              <Typography>10:00</Typography>
            </Box>
            <Box my={2}>
              <Typography variant="h6">
                {currentMatch.white.name}(
                {currentMatch.white.ratings.uscf.ratings.blitz.rating})
              </Typography>
            </Box>
            <canvas
              width={192}
              height={120}
              id={`${currentMatch.white.username}-video`}
              style={{
                borderRadius: 8,
                background: "black",
                transform: "scaleX(-1)",
              }}
            ></canvas>
          </Box>
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
            bgcolor="#134378"
            zIndex={3}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Match;
