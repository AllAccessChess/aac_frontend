import { RoundStatus } from "constant";

export const mathRound2 = (num) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const mathRound4 = (num) => Math.round(num * 10000) / 10000;

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const tableComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const isMatchOwner = (match, user) => {
  return !!(
    match &&
    user &&
    user.username &&
    (match.black.username === user.username ||
      match.white.username === user.username)
  );
};

export const pad2 = (number) => {
  return (number < 10 ? "0" : "") + number;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getRemainingTimeString = (remaining) => {
  let string = "";
  if (remaining > 1000 * 60 * 60 * 24) {
    string += Math.floor(remaining / (1000 * 60 * 60) / 24) + "d ";
  }
  if (remaining > 1000 * 60 * 60) {
    string += pad2(Math.floor((remaining / (1000 * 60 * 60)) % 24)) + "h ";
  }
  if (remaining > 1000 * 60) {
    string += pad2(Math.floor((remaining / (1000 * 60)) % 60)) + "min ";
  }
  string += pad2(Math.floor((remaining / 1000) % 60)) + "s";
  return string;
};

export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const validatePairing = ({ pairings, players, unpaired, byes }) => {
  const invalid = [...unpaired, ...byes];
  return {
    pairings: pairings.map((pairing) => ({
      white: invalid.includes(pairing.white) ? null : pairing.white,
      black: invalid.includes(pairing.black) ? null : pairing.black,
    })),
    players,
    unpaired,
    byes,
  };
};

export const redoPairing = (
  white,
  black,
  unpaired,
  byes,
  source,
  destination
) => {
  let whiteRes = [...white];
  let blackRes = [...black];
  let unpairedRes = [...unpaired];
  let byesRes = [...byes];

  const emptyIndexMatch = destination.droppableId.match(
    /^(black|white)-empty-(\d)+$/
  );
  const emptyIndex =
    emptyIndexMatch && emptyIndexMatch.length > 2
      ? parseInt(emptyIndexMatch[2])
      : 0;

  if (source.droppableId === "unpaired") {
    const [removed] = unpairedRes.splice(source.index, 1);
    if (destination.droppableId === "byes") {
      // unpaired -> byes
      byesRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId === "white") {
      // unpaired -> white
      whiteRes.splice(destination.index, 0, removed);
      blackRes.splice(destination.index, 0, null);
    } else if (destination.droppableId === "black") {
      // unpaired -> black
      whiteRes.splice(destination.index, 0, null);
      blackRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId.includes("white-empty")) {
      // unpaired -> white empty
      whiteRes.splice(emptyIndex, 1, removed);
    } else if (destination.droppableId.includes("black-empty")) {
      // unpaired -> black empty
      blackRes.splice(emptyIndex, 1, removed);
    }
  } else if (source.droppableId === "byes") {
    const [removed] = byesRes.splice(source.index, 1);
    if (destination.droppableId === "unpaired") {
      // byes -> unpaired
      unpairedRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId === "white") {
      // byes -> white
      whiteRes.splice(destination.index, 0, removed);
      blackRes.splice(destination.index, 0, null);
    } else if (destination.droppableId === "black") {
      // byes -> black
      whiteRes.splice(destination.index, 0, null);
      blackRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId.includes("white-empty")) {
      // byes -> white empty
      whiteRes.splice(emptyIndex, 1, removed);
    } else if (destination.droppableId.includes("black-empty")) {
      // unpaired -> black empty
      blackRes.splice(emptyIndex, 1, removed);
    }
  } else if (source.droppableId === "white") {
    let sourceIndex = source.index;
    const removed = white[sourceIndex];

    if (destination.droppableId === "unpaired") {
      // white -> unpaired
      unpairedRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId === "byes") {
      // white -> byes
      byesRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId.includes("black-empty")) {
      // white -> black-empty
      blackRes[emptyIndex] = removed;
    } else if (destination.droppableId.includes("white-empty")) {
      // white -> white-empty
      whiteRes[emptyIndex] = removed;
    } else if (destination.droppableId === "black") {
      // white -> black
      if (destination.index < sourceIndex) {
        sourceIndex += 1;
      }
      blackRes.splice(destination.index, 0, removed);
      whiteRes.splice(destination.index, 0, null);
    }

    if (blackRes[sourceIndex] === null) {
      whiteRes.splice(sourceIndex, 1);
      blackRes.splice(sourceIndex, 1);
    } else {
      whiteRes[sourceIndex] = null;
    }
  } else if (source.droppableId === "black") {
    let sourceIndex = source.index;
    const removed = black[sourceIndex];

    if (destination.droppableId === "unpaired") {
      // black -> unpaired
      unpairedRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId === "byes") {
      // black -> byes
      byesRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId.includes("black-empty")) {
      // black -> black-empty
      blackRes[emptyIndex] = removed;
    } else if (destination.droppableId.includes("white-empty")) {
      // black -> white-empty
      whiteRes[emptyIndex] = removed;
    } else if (destination.droppableId === "white") {
      // black -> white
      if (destination.index < sourceIndex) {
        sourceIndex += 1;
      }
      whiteRes.splice(destination.index, 0, removed);
      blackRes.splice(destination.index, 0, null);
    }

    if (whiteRes[sourceIndex] === null) {
      whiteRes.splice(sourceIndex, 1);
      blackRes.splice(sourceIndex, 1);
    } else {
      blackRes[sourceIndex] = null;
    }
  }

  return {
    white: whiteRes,
    black: blackRes,
    byes: byesRes,
    unpaired: unpairedRes,
  };
};

export const isAdmin = (user) => {
  return user && user.permissions && user.permissions.includes("admin");
};

export const getRoundStateString = (state, isOwner = false) => {
  const roundStateString = {
    [RoundStatus.FINISHED]: "Finished",
    [RoundStatus.PLAYING]: isOwner ? "Play Now" : "Watch Live",
    [RoundStatus.PREP]: "Waiting for players",
    [RoundStatus.SETUP]: "Scheduled",
  };

  return roundStateString[state];
};

export const getWinnerString = (result) => {
  if (result === "1-0") {
    return "White";
  }
  if (result === "0-1") {
    return "Black";
  }
  if (result === "1/2-1/2") {
    return "Draw";
  }
  return "-";
};

export const getPlayerScores = (tournament, player) => {
  const scores = new Array(tournament.settings.numRounds);

  const scoreData = {
    black: {
      "1-0": 2,
      "1/2-1/2": 1,
      "0-1": 0,
      "*": "-",
    },
    white: {
      "1-0": 0,
      "1/2-1/2": 1,
      "0-1": 2,
      "*": "-",
    },
  };

  for (let index = 0; index < tournament.settings.numRounds; index++) {
    try {
      const playerBoard = tournament.rounds[index].boards.find((board) =>
        board.playerIds.includes(player.id)
      );
      const playerColor =
        playerBoard.playerIds[0] === player.id ? "black" : "white";
      scores[index] = scoreData[playerColor][playerBoard.result];
    } catch (err) {
      try {
        if (tournament.rounds[index].byes.includes(player.id)) {
          scores[index] = "1/2";
        } else {
          scores[index] = "-";
        }
      } catch (err) {
        scores[index] = "-";
      }
    }
  }

  return scores;
};

export const getValidUserName = (match, id, name) => {
  return match.players[0].name === match.players[1].name
    ? `${name} ${match.players[0].id === id ? "1" : "2"}`
    : name;
};

export const snakeCaseString = (string) => {
  return string
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
};

export const findFromMoveTree = (moveTree, moveId) => {
  if (moveTree.id === moveId) {
    return moveTree;
  }

  for (const subTree of moveTree.children) {
    const moveTree = findFromMoveTree(subTree, moveId);
    if (moveTree) {
      return moveTree;
    }
  }

  return null;
};

export const addToMoveTree = (
  moveTree,
  parentId,
  moveId,
  move,
  fen,
  score = null
) => {
  if (!moveTree) {
    return {
      id: moveId,
      level: 1,
      move,
      fen,
      score,
      children: [],
    };
  }

  if (moveTree.id === parentId) {
    moveTree.children.push({
      id: moveId,
      level: moveTree.level + 1,
      move,
      fen,
      score,
      children: [],
    });

    return moveTree;
  }

  if (!moveTree.children) {
    return moveTree;
  }

  return {
    ...moveTree,
    children: moveTree.children.map((subTree) =>
      addToMoveTree(subTree, parentId, moveId, move, fen)
    ),
  };
};

export const getMovesFromTree = (moveTree, currentMoveId) => {
  if (!moveTree) {
    return [];
  }

  const moves = [];

  if (moveTree.id === currentMoveId) {
    moves.push(moveTree.move);
  } else {
    const subMoves = [];
    for (const subTree of moveTree.children) {
      subMoves.push(...getMovesFromTree(subTree, currentMoveId));
    }

    if (subMoves.length) {
      moves.push(moveTree.move, ...subMoves);
    }
  }

  return moves;
};

export const updateScore = (moveTree, currentMoveId, score) => {
  if (!moveTree) {
    return moveTree;
  }

  return {
    ...moveTree,
    score: moveTree.id === currentMoveId ? score : moveTree.score,
    children: moveTree.children.map((subTree) =>
      updateScore(subTree, currentMoveId, score)
    ),
  };
};
