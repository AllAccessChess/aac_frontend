import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTheme } from "@material-ui/core";
import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@material-ui/icons";

import { Box, Button, Typography } from "components/material-ui";
import { redoPairing, reorderList } from "utils/common";

import {
  Container,
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
                      <Typography variant="body1">
                        {player
                          ? `${player.name} (${player.score || 0})`
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

  const toggleExpanded = () => {
    if (!bracket.merged) {
      setExpanded((expanded) => !expanded);
    }
  };

  return (
    <Wrapper>
      <Header
        onClick={toggleExpanded}
        bgcolor={
          bracket.merged
            ? theme.palette.primary.dark
            : theme.palette.primary.main
        }
        merged={bracket.merged.toString()}
        expanded={expanded.toString()}
      >
        <Typography>
          Under {bracket.upper}({players.length})
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Header>
      {!bracket.merged && expanded && (
        <Container expanded={expanded.toString()}>
          <Box display="flex" mb="2rem">
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
