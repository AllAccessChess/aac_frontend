import React, { useMemo, useCallback } from "react";
import { Box, Typography } from "components/material-ui";

import { PiecePoint } from "constant";

import queenIcon from "assets/icons/Q.svg";
import rockIcon from "assets/icons/R.svg";
import bishopIcon from "assets/icons/B.svg";
import knightIcon from "assets/icons/N.svg";
import pawnIcon from "assets/icons/P.svg";

export const MaterialCaptcha = (props) => {
  const { pieceDifference, color } = props;

  const score = useMemo(() => {
    let sum = 0;
    for (let index of Object.keys(pieceDifference)) {
      sum += PiecePoint[index] * pieceDifference[index];
    }

    return sum;
  }, [pieceDifference]);

  const getIcon = useCallback((piece) => {
    if (piece === "queen") return queenIcon;
    if (piece === "rook") return rockIcon;
    if (piece === "bishop") return bishopIcon;
    if (piece === "kinght") return knightIcon;
    return pawnIcon;
  }, []);

  return (
    <Box display="flex" alignItems="center" height="30px" my={2}>
      {Object.keys(pieceDifference).map((pieceKey) => (
        <Box display="flex" key={pieceKey}>
          {(pieceDifference[pieceKey] > 0 && color) ||
          (pieceDifference[pieceKey] < 0 && !color) ? (
            [...Array(Math.abs(pieceDifference[pieceKey])).keys()].map(
              (val, index) => (
                <Box key={index} mr={1} width="30px" height="30px">
                  <img
                    src={getIcon(pieceKey)}
                    alt={pieceKey}
                    width="100%"
                    height="100%"
                  />
                </Box>
              )
            )
          ) : (
            <></>
          )}
        </Box>
      ))}
      {(score > 0 && color) || (score < 0 && !color) ? (
        <Typography>+ {Math.abs(score)}</Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};
