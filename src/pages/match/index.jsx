import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import config from "config";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";
import GameClient from "utils/gameClient";

import { Box, Typography } from "@material-ui/core";
import { AccessTime as AccessTimeIcon } from "@material-ui/icons";

import ScreenLoader from "components/common/ScreenLoader";
import ChessBoard from "components/ChessBoard";
import Header from "./Header";
import ActionHistory from "./ActionHistory";

import { GameStatus, GameActions } from "constant";
import { getMatch } from "redux/reducers/matchReducer";

import { useZoomContext } from "lib/zoom";
import { generateSignature } from "lib/zoom/client/helpers";

const Match = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const gameClientRef = useRef(new GameClient(config.socketURL));

  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState();
  const [pendingMove, setPendingMove] = useState();
  const [gameStatus, setGameStatus] = useState(GameStatus.Preparing);
  const [meetingJoined, setMeetingJoined] = useState(false);

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const moveHistory = useSelector((state) => state.matchReducer.history);

  const { zoomClient } = useZoomContext();
  const zoomPreviewRef = useRef(null);
  const userCountRef = useRef(1);

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
  }, []);

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
        userName: "Zoom Test",
        userEmail: "test@gmail.com",
      });

      zoomClient.on("onUserJoin", (data) => {
        setTimeout(() => {
          console.log("onUserJoin", data, userCountRef.current);
          if (zoomClient.getUserName(data.userId) !== "Richard Zhan") {
            const userVideoCanvas = document.getElementById(
              `player${userCountRef.current}`
            );

            userCountRef.current += 1;

            zoomClient.renderUserVideo(data.userId, userVideoCanvas);
          }
        }, 5000);
      });

      zoomClient.on("joinClicked", () => {
        setMeetingJoined(true);
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

    // if (zoomClient && zoomPreviewRef.current) {
    joinMeeting();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentMatch) return <ScreenLoader />;
  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <Header
        currentMatch={currentMatch}
        gameStatus={gameStatus}
        onOfferDraw={handleOfferDraw}
        onResign={handleResign}
        onStartGame={startGame}
      />
      <Box
        px={10}
        py={5}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
          width={240}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <canvas
              width={192}
              height={120}
              id="player1"
              style={{ borderRadius: 8, background: "black" }}
            ></canvas>
            <Box my={2}>
              <Typography variant="h6">
                {currentMatch.players[0].name}(1400)
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
                {currentMatch.players[1].name}(300)
              </Typography>
            </Box>
            <canvas
              width={192}
              height={120}
              id="player2"
              style={{ borderRadius: 8, background: "black" }}
            ></canvas>
          </Box>
          <Box
            display={meetingJoined ? "none" : "flex"}
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
        <Box mx={3} pt={5} pl={5} bgcolor="#134378" borderRadius={10}>
          <ChessBoard
            width="38vw"
            height="38vw"
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

        <ActionHistory
          height="calc(38vw + 40px)"
          width="350px"
          moveHistory={moveHistory}
        />
      </Box>
    </Box>
  );
};

export default Match;
