import React from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper,
} from "components/material-ui";
import { CellItem, EndActions } from "./components";
import { GameStatus } from "constant";

export const MoveList = (props) => {
  const {
    playerColor,
    isSpectator,
    moveList,
    gameStatus,
    askingDraw,
    pastMoveIndex,
    onOfferDraw,
    onResign,
    onAcceptDraw,
    onDeclineDraw,
    onExitSpectating,
    onShowPast,
  } = props;

  return (
    <Box
      bgcolor="#134378"
      borderRadius={10}
      height="100%"
      display="flex"
      flexDirection="column"
      py={3}
    >
      <TableContainer
        component={Paper}
        style={{
          height:
            gameStatus !== GameStatus.EXITED ? `calc(100% - 70px)` : "100%",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">S.No.</TableCell>
              <TableCell align="center">White</TableCell>
              <TableCell align="center">Black</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(Math.ceil(moveList.length / 2)).keys()].map((index) => (
              <TableRow key={index}>
                <CellItem cell={index + 1} align="center" />
                <CellItem
                  cell={moveList[index * 2]}
                  active={
                    pastMoveIndex === -1
                      ? index * 2 === moveList.length - 1
                      : index * 2 === pastMoveIndex
                  }
                  align="center"
                  onClick={() => onShowPast(index * 2)}
                />
                {index * 2 + 1 < moveList.length ? (
                  <CellItem
                    align="center"
                    cell={moveList[index * 2 + 1]}
                    active={
                      pastMoveIndex === -1
                        ? index * 2 + 1 === moveList.length - 1
                        : index * 2 + 1 === pastMoveIndex
                    }
                    onClick={() => onShowPast(index * 2 + 1)}
                  />
                ) : (
                  <></>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {gameStatus !== GameStatus.EXITED ? (
        <>
          <Box my={3}>
            <Divider />
          </Box>
          <EndActions
            isSpectator={isSpectator}
            playerColor={playerColor}
            askingDraw={askingDraw}
            onOfferDraw={onOfferDraw}
            onResign={onResign}
            onAcceptDraw={onAcceptDraw}
            onDeclineDraw={onDeclineDraw}
            onExitSpectating={onExitSpectating}
          />
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
