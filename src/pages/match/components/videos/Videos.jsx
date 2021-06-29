import React from "react";

import { getValidUserName, snakeCaseString } from "lib/zoom/client/helpers";

import { VideoCanvas } from "./styles";

export const Videos = (props) => {
  const { match, playerColor } = props;

  const player1Id = snakeCaseString(
    getValidUserName(match, match.players[0].id, match.players[0].name)
  );

  const player2Id = snakeCaseString(
    getValidUserName(match, match.players[1].id, match.players[1].name)
  );

  return (
    <React.Fragment>
      <VideoCanvas
        width={384}
        height={240}
        id={playerColor ? `${player1Id}-video` : `${player2Id}-video`}
      ></VideoCanvas>
      <VideoCanvas
        width={384}
        height={240}
        id={playerColor ? `${player2Id}-video` : `${player1Id}-video`}
      ></VideoCanvas>
    </React.Fragment>
  );
};
