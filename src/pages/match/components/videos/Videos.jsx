import React from "react";

// import { Button } from "components/material-ui";
import { getValidUserName, snakeCaseString } from "lib/zoom/client/helpers";

import { UserVideo } from "./styles";

export const Videos = (props) => {
  // const { match, playerColor, usingVideo } = props;
  const { match, playerColor } = props;

  const player1Id = snakeCaseString(
    getValidUserName(match, match.players[0].id, match.players[0].name)
  );

  const player2Id = snakeCaseString(
    getValidUserName(match, match.players[1].id, match.players[1].name)
  );

  return (
    <React.Fragment>
      {/* <Button
        color={usingVideo ? "secondary" : "primary"}
        variant="contained"
        onClick={props.onToggleUsingVideo}
      >
        {usingVideo ? "Stop Video" : "Start Video"}
      </Button> */}
      <UserVideo
        width={384}
        height={240}
        autoPlay
        id={playerColor ? `${player1Id}-video` : `${player2Id}-video`}
      />
      <audio id={playerColor ? `${player1Id}-audio` : `${player2Id}-audio`} />
      <UserVideo
        width={384}
        height={240}
        autoPlay
        id={playerColor ? `${player2Id}-video` : `${player1Id}-video`}
      />
      <audio id={playerColor ? `${player2Id}-audio` : `${player1Id}-audio`} />
    </React.Fragment>
  );
};
