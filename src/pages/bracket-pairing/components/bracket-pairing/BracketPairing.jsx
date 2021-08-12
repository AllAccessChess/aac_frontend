import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTheme } from "@material-ui/core";
import { lightGreen } from "@material-ui/core/colors";
import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@material-ui/icons";

import { Box, Button, Grid, Typography } from "components/material-ui";
import { clearEmptyPairing, redoPairing, reorderList } from "utils/common";

import {
  BoardHeader,
  BoardSquare,
  Container,
  DragFocus,
  DroppableBox,
  Header,
  Tree,
  TreeButton,
  TreeButtonWrapper,
  Wrapper,
} from "./styles";

export const BracketPairing = (props) => {
  const { bracket, prevBracket, players, showTree, last } = props;

  const [white, setWhite] = useState([]);
  const [black, setBlack] = useState([]);
  const [unpaired, setUnpaired] = useState([]);
  const [byes, setByes] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setWhite(props.boards.map((board) => board.playerIds[0]));
    setBlack(props.boards.map((board) => board.playerIds[1]));
  }, [props.boards]);

  useEffect(() => {
    setUnpaired([...props.unpaired]);
  }, [props.unpaired]);

  useEffect(() => {
    setByes([...props.byes]);
  }, [props.byes]);

  const handleClickUpdate = () => {
    if (!props.onUpdate) {
      return;
    }

    const pairings = [];
    for (let index = 0; index < white.length; index++) {
      if (white[index] && black[index]) {
        pairings.push({ white: white[index], black: black[index] });
      }
    }
    props.onUpdate(bracket.index, {
      pairings,
      unpaired,
      byes,
    });
  };

  const handleClickMerge = () => {
    if (!props.onMerge) {
      return;
    }
    props.onMerge(bracket.index);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    let newPairing;
    if (source.droppableId === destination.droppableId) {
      switch (source.droppableId) {
        case "white":
          newPairing = clearEmptyPairing(
            reorderList(white, source.index, destination.index),
            black
          );
          setWhite(newPairing.white);
          setBlack(newPairing.black);
          break;
        case "black":
          newPairing = clearEmptyPairing(
            white,
            reorderList(black, source.index, destination.index)
          );
          setWhite(newPairing.white);
          setBlack(newPairing.black);
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
      newPairing = redoPairing(
        white,
        black,
        unpaired,
        byes,
        source,
        destination
      );
      setWhite(newPairing.white);
      setBlack(newPairing.black);
      setByes(newPairing.byes);
      setUnpaired(newPairing.unpaired);
    }
  };

  const renderDroppableList = (id, list) => (
    <Droppable droppableId={id} type="droppableItem">
      {(provided, snapshot) => (
        <DroppableBox
          ref={provided.innerRef}
          draggingover={snapshot.isDraggingOver ? "true" : "false"}
        >
          {list.map((item, index) => {
            const player = players.find((player) => player.id === item);

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
                    my="1.5rem"
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
                    <DragFocus dragging={snapshot.isDragging.toString()} />
                    <Box
                      flexGrow={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height={40}
                    >
                      <Typography variant="body1">
                        {player
                          ? `${player.name} (${player.rating || 0}) - ${
                              player.score || 0
                            }`
                          : "Empty"}
                      </Typography>
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
                            bgcolor={
                              snapshot.isDraggingOver
                                ? lightGreen[400]
                                : "transparent"
                            }
                            width={60}
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
        </DroppableBox>
      )}
    </Droppable>
  );

  const toggleExpanded = () => {
    if (!bracket.merged && !!players.length) {
      setExpanded((expanded) => !expanded);
    }
  };

  return (
    <Wrapper>
      <Header
        onClick={toggleExpanded}
        bgcolor={
          bracket.merged || players.length === 0
            ? theme.palette.primary.dark
            : theme.palette.primary.main
        }
        merged={(bracket.merged || players.length === 0).toString()}
        expanded={expanded.toString()}
      >
        <Typography>
          Under {bracket.upper} ({players.length} Players)
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Header>
      {expanded && (
        <Container expanded={expanded.toString()}>
          <Box display="flex" mb="2rem">
            <DragDropContext onDragEnd={onDragEnd}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mr={15}
                bgcolor={theme.palette.background.paper}
                borderRadius={12}
                p={5}
              >
                <Box mb={5}>
                  <Typography variant="h3">Boards</Typography>
                </Box>
                <Box display="flex" position="relative">
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        <Box mt="42px" p="1rem">
                          {white.map((_item, index) => (
                            <Box
                              my="1.5rem"
                              key={`bracket-${bracket.id}-round-${index}`}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height={42}
                              >
                                <Typography variant="body1">
                                  {index + 1}.
                                </Typography>
                              </Box>
                              <BoardSquare />
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box flexGrow={1}>
                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <BoardHeader>
                          <Typography variant="body1">White</Typography>
                        </BoardHeader>
                        {renderDroppableList("white", white)}
                      </Grid>
                      <Grid item md={6}>
                        <BoardHeader>
                          <Typography variant="body1">Black</Typography>
                        </BoardHeader>
                        {renderDroppableList("black", black)}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column">
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  bgcolor={theme.palette.background.paper}
                  borderRadius={12}
                  mb={5}
                  p={5}
                >
                  <Box mb={5}>
                    <Typography variant="h3">Unpaired</Typography>
                  </Box>
                  {renderDroppableList("unpaired", unpaired)}
                </Box>
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  bgcolor={theme.palette.background.paper}
                  borderRadius={12}
                  p={5}
                >
                  <Box mb={5}>
                    <Typography variant="h3">Byes</Typography>
                  </Box>
                  {renderDroppableList("byes", byes)}
                </Box>
              </Box>
            </DragDropContext>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickUpdate}
          >
            Update
          </Button>
        </Container>
      )}
      {showTree && (
        <Tree
          last={last.toString()}
          merged={bracket.merged.toString()}
          prevMerged={(prevBracket && prevBracket.merged
            ? true
            : false
          ).toString()}
        >
          {!last && (
            <TreeButtonWrapper>
              <TreeButton
                merged={bracket.merged.toString()}
                size="small"
                onClick={handleClickMerge}
              >
                {bracket.merged ? <CloseIcon /> : <AddIcon />}
              </TreeButton>
            </TreeButtonWrapper>
          )}
        </Tree>
      )}
    </Wrapper>
  );
};
