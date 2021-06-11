import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router";
import config from "config";
import Chess from "chess.js";
import { useSelector, useDispatch } from "react-redux";
import GameClient from "utils/gameClient";

import { Box, Button, Typography } from "@material-ui/core";
import ScreenLoader from "components/common/ScreenLoader";
import ChessBoard from "components/ChessBoard";

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

  // const reset = useCallback(() => {
  //   chess.reset();
  //   setFen(chess.fen());
  //   setLastMove(null);
  //   dispatch(setHistory([]));
  // }, [dispatch, chess, setFen, setLastMove]);

  // const undo = useCallback(() => {
  //   chess.undo();
  //   chess.undo();
  //   setFen(chess.fen());
  //   setLastMove(null);
  //   dispatch(popHistoryItem(2));
  // }, [dispatch, chess, setFen, setLastMove]);
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
        userName: "Richard Zhan",
        userEmail: "richard.zhan929@gmail.com",
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
    <Box width="100%" display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
      >
        <h2>
          {currentMatch.black}(Black) vs {currentMatch.white}(White)
        </h2>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="flex-start"
          width="300px"
        >
          {gameStatus === GameStatus.Ready ? (
            <Button variant="outlined" color="secondary" onClick={startGame}>
              Start
            </Button>
          ) : (
            <></>
          )}
          {gameStatus === GameStatus.Started ? (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOfferDraw}
              >
                Offer Draw
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleResign}
              >
                Resign
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">{currentMatch.black}</Typography>
          <ChessBoard
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
          <Typography variant="h6">{currentMatch.white}</Typography>
        </Box>

        <Box display="flex" ref={zoomPreviewRef} />
        <Box
          display="flex"
          flexDirection="column"
          ref={zoomVideoContainerRef}
        />

        <Box display="flex" flexDirection="column">
          {moveHistory.map((move, index) => (
            <Typography key={index}>
              {index + 1} {move.san}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Match;
