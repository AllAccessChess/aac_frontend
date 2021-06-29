import React from "react";

import { VideoCanvas } from "./styles";

export const Videos = (props) => {
  const { match, playerColor } = props;

  return (
    <React.Fragment>
      <VideoCanvas
        width={384}
        height={240}
        id={
          playerColor
            ? `${match.players[0].id}-video`
            : `${match.players[1].id}-video`
        }
      ></VideoCanvas>
      <VideoCanvas
        width={384}
        height={240}
        id={
          playerColor
            ? `${match.players[1].id}-video`
            : `${match.players[0].id}-video`
        }
      ></VideoCanvas>
    </React.Fragment>
  );
};
