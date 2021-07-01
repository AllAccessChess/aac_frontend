import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTheme } from "@material-ui/core";
import { ChevronLeft as BackIcon } from "@material-ui/icons";

import { Box, Button, Typography } from "components/material-ui";
import { LoadingScreen } from "components/common";
import {
  getPairings,
  getTournament,
  updatePairings,
} from "redux/reducers/tournamentReducer";
import { redoPairing, reorderList } from "utils/common";

export const Pairing = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );
  const pairings = useSelector((state) => state.tournamentReducer.pairings);

  const [white, setWhite] = useState([]);
  const [black, setBlack] = useState([]);
  const [unpaired, setUnpaired] = useState([]);
  const [byes, setByes] = useState([]);

  const handleBack = () => {
    history.push(`/tournament/${params.tournamentId}`);
  };

  useEffect(() => {
    if (params.tournamentId && params.roundId) {
      dispatch(getTournament(params.tournamentId));
      dispatch(getPairings(params.tournamentId, params.roundId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pairings) {
      setWhite(pairings.pairings.map((pairing) => pairing.white));
      setBlack(pairings.pairings.map((pairing) => pairing.black));
      setUnpaired(pairings.unpaired);
      setByes(pairings.byes || []);
    }
  }, [pairings]);

  if (!pairings || !currentTournament) return <LoadingScreen />;

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      switch (source.droppableId) {
        case "white":
        case "black":
          setWhite(reorderList(white, source.index, destination.index));
          setBlack(reorderList(black, source.index, destination.index));
          break;
        case "unpaired":
          setUnpaired(reorderList(unpaired, source.index, destination.index));
          break;
        case "byes":
          setByes(reorderList(byes, source.index, destination.index));
          break;
        default:
          break;
      }
    } else {
      const rePairing = redoPairing(
        white,
        black,
        unpaired,
        byes,
        source,
        destination
      );
      setWhite(rePairing.white);
      setBlack(rePairing.black);
      setByes(rePairing.byes);
      setUnpaired(rePairing.unpaired);
    }
  };

  const handleClickUpdate = () => {
    const pairings = [];
    for (let index = 0; index < white.length; index++) {
      if (white[index] && black[index]) {
        pairings.push({ white: white[index], black: black[index] });
      }
    }
    dispatch(updatePairings(currentTournament.id, params.roundId, pairings));
  };

  const renderDroppableList = (id, list) => (
    <Droppable droppableId={id} type="droppableItem">
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          p={2}
          border={`1px dashed ${
            snapshot.isDraggingOver
              ? theme.palette.secondary.main
              : theme.palette.primary.light
          }`}
          width={250}
        >
          {list.map((item, index) => {
            const player = pairings.players.find(
              (player) => player.id === item
            );

            const key = player ? player.id : `${id}-empty-${index}`;

            return (
              <Draggable
                key={key}
                draggableId={key}
                index={index}
                isDragDisabled={!player}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={4}
                    border={`1px ${player ? "solid" : "dashed"} ${
                      theme.palette.primary.main
                    }`}
                    my={3}
                    bgcolor={
                      snapshot.isDragging
                        ? theme.palette.primary.dark
                        : player
                        ? theme.palette.primary.main
                        : "transparent"
                    }
                    style={{
                      ...provided.draggableProps.style,
                    }}
                    position="relative"
                  >
                    <Box
                      p={2}
                      flexGrow={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Typography>{player ? player.name : "Empty"}</Typography>
                    </Box>
                    {!player && (
                      <Droppable droppableId={key} type="droppableItem">
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            border={`1px dashed ${
                              snapshot.isDraggingOver
                                ? theme.palette.secondary.main
                                : theme.palette.primary.light
                            }`}
                            width={100}
                            height={40}
                          >
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    )}
                  </Box>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Button startIcon={<BackIcon />} onClick={handleBack}>
        Go Back
      </Button>

      <Box
        width="100%"
        my={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h2">
          {currentTournament.title} - Round {parseInt(params.roundId) + 1}
        </Typography>
        <Box display="flex" my={5}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mr={5}
              bgcolor={theme.palette.background.paper}
              borderRadius={12}
              p={5}
            >
              <Typography variant="h3">Pairings</Typography>
              <Box display="flex" mt={5}>
                {renderDroppableList("white", white)}
                {renderDroppableList("black", black)}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              bgcolor={theme.palette.background.paper}
              borderRadius={12}
              mr={5}
              p={5}
            >
              <Typography variant="h3">Unpaired</Typography>
              <Box display="flex" mt={5}>
                {renderDroppableList("unpaired", unpaired)}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              bgcolor={theme.palette.background.paper}
              borderRadius={12}
              p={5}
            >
              <Typography variant="h3">Byes</Typography>
              <Box display="flex" mt={5}>
                {renderDroppableList("byes", byes)}
              </Box>
            </Box>
          </DragDropContext>
        </Box>
        <Button variant="contained" color="primary" onClick={handleClickUpdate}>
          Update
        </Button>
      </Box>
    </Box>
  );
};
