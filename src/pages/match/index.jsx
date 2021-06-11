import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router";
import config from "config";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";
import GameClient from "utils/gameClient";

import { Box } from "@material-ui/core";
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

  const currentMatch = useSelector((state) => state.matchReducer.current);
  const moveHistory = useSelector((state) => state.matchReducer.history);

  const { zoomClient } = useZoomContext();
  const zoomPreviewRef = useRef(null);
  const zoomVideoContainerRef = useRef(null);

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
        if (zoomVideoContainerRef.current) {
          const userVideoCanvas = document.createElement("canvas");
          userVideoCanvas.setAttribute("id", `zoom-user-${data.userId}`);
          userVideoCanvas.setAttribute("width", 192);
          userVideoCanvas.setAttribute("height", 120);
          userVideoCanvas.style.width = "192px";
          userVideoCanvas.style.height = "120px";

          zoomVideoContainerRef.current.appendChild(userVideoCanvas);

          zoomClient.renderUserVideo(data.userId, userVideoCanvas);
        }
      });

      await zoomClient.joinMeeting(
        {
          meetingNumber,
          passWord,
          signature,
          leaveUrl: "http://localhost:3000/tournament/0",
        },
        zoomPreviewRef.current
      );
    };

    if (zoomClient) {
      joinMeeting();
    }
  }, [zoomClient]);

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
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* <Typography variant="h6">{currentMatch.players[0].name}</Typography> */}
          <Box display="flex" ref={zoomPreviewRef} />
          <Box
            display="flex"
            flexDirection="column"
            ref={zoomVideoContainerRef}
          />
          {/* <Typography variant="h6">{currentMatch.players[1].name}</Typography> */}
        </Box>
        <Box pt={5} pl={5} bgcolor="#134378" borderRadius={10}>
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
