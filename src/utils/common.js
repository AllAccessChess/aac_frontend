import { GameResults, RoundStatus, VALID_USCF_LENGTH } from "constant";

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
      blackRes.splice(destination.index, 0);
      blackRes.push(null);
    } else if (destination.droppableId === "black") {
      // unpaired -> black
      whiteRes.splice(destination.index, 0);
      whiteRes.push(null);
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
      blackRes.splice(destination.index, 0);
      blackRes.push(null);
    } else if (destination.droppableId === "black") {
      // byes -> black
      whiteRes.splice(destination.index, 0);
      whiteRes.push(null);
      blackRes.splice(destination.index, 0, removed);
    } else if (destination.droppableId.includes("white-empty")) {
      // byes -> white empty
      whiteRes.splice(emptyIndex, 1, removed);
    } else if (destination.droppableId.includes("black-empty")) {
      // unpaired -> black empty
      blackRes.splice(emptyIndex, 1, removed);
    }
  } else if (source.droppableId === "white") {
    const removed = white[source.index];

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
      blackRes.splice(destination.index, 0, removed);
      whiteRes.push(null);
    }
    whiteRes.splice(source.index, 1);
    whiteRes.push(null);
  } else if (source.droppableId === "black") {
    const removed = black[source.index];

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
      whiteRes.splice(destination.index, 0, removed);
      blackRes.push(null);
    }
    blackRes.splice(source.index, 1);
    blackRes.push(null);
  }

  const clearedPairing = clearEmptyPairing(whiteRes, blackRes);

  return {
    white: clearedPairing.white,
    black: clearedPairing.black,
    byes: byesRes,
    unpaired: unpairedRes,
  };
};

export const clearEmptyPairing = (white, black) => {
  const whiteRes = [...white];
  const blackRes = [...black];

  for (let index = 0; index < whiteRes.length; index++) {
    if (whiteRes[index] === null && blackRes[index] === null) {
      whiteRes.splice(index, 1);
      blackRes.splice(index, 1);
    }
  }

  return {
    white: whiteRes,
    black: blackRes,
  };
};

export const isAdmin = (user) => {
  return user && user.permissions && user.permissions.includes("admin");
};

export const getRoundStateString = (state, matchResult, isOwner = false) => {
  if (matchResult !== GameResults.ONGOING) return "Finished";

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

export const getPlayerScores = (bracket, numRounds, player) => {
  const scores = new Array(numRounds);

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

  for (let index = 0; index < numRounds; index++) {
    try {
      const playerBoard = bracket.rounds[index].boards.find((board) =>
        board.playerIds.includes(player.id)
      );
      const playerColor =
        playerBoard.playerIds[0] === player.id ? "black" : "white";
      scores[index] = scoreData[playerColor][playerBoard.result];
    } catch (err) {
      try {
        if (bracket.rounds[index].byes.includes(player.id)) {
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
  if (!moveTree) {
    return null;
  }

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

export const getRatingCategory = (startTime, increment) => {
  let x = startTime + increment / 60;
  if (x < 3) return "Bullet";
  if (x <= 10) return "Blitz";
  if (x < 30) return "Rapid";
  return "Classic";
};

export const pvSanToPossibleMoves = (pvSan, level) => {
  const pvMoves = pvSan.split(" ");

  if (pvMoves.length % 2 === 1) {
    pvMoves.push("");
  }

  let curLevel = Math.ceil((level + 1) / 2);

  let possibleMovesStr = "";

  if (level % 2 === 1) {
    pvMoves.unshift("");
  }

  if (level % 2 === 1) {
    possibleMovesStr = `${curLevel}... ${pvMoves[1]}`;
  } else {
    possibleMovesStr = `${curLevel}. ${pvMoves[0]} ${pvMoves[1]}`;
  }

  for (let index = 1; index < Math.floor(pvMoves.length / 2); index++) {
    possibleMovesStr += ` ${curLevel + index}. ${pvMoves[2 * index]} ${
      pvMoves[2 * index + 1]
    }`;
  }

  return possibleMovesStr;
};

export const validateUSCFID = (uscfID) => {
  if (!uscfID || !uscfID.length) return true;
  if (uscfID.length !== VALID_USCF_LENGTH) return false;
  return /^\d+$/.test(uscfID);
};

export const getBracketPairings = (
  tournament,
  brackets,
  bracketIndex,
  roundIndex
) => {
  let boards = [],
    byes = [],
    players = [];

  boards = tournament.brackets[bracketIndex].rounds[roundIndex]
    ? tournament.brackets[bracketIndex].rounds[roundIndex].boards
    : [];
  byes = tournament.brackets[bracketIndex].rounds[roundIndex]
    ? tournament.brackets[bracketIndex].rounds[roundIndex].byes
    : [];
  players = tournament.brackets[bracketIndex].players;

  for (let index = bracketIndex - 1; index >= 0; index--) {
    const bracket = brackets.find((bracket) => bracket.index === index);

    if (bracket && bracket.merged) {
      boards = [
        ...boards,
        ...(tournament.brackets[index].rounds[roundIndex]
          ? tournament.brackets[index].rounds[roundIndex].boards
          : []),
      ];
      byes = [
        ...byes,
        ...(tournament.brackets[index].rounds[roundIndex]
          ? tournament.brackets[index].rounds[roundIndex].byes
          : []),
      ];
      players = [...players, ...tournament.brackets[index].players];
    } else {
      break;
    }
  }

  const unpaired = players
    .filter(
      (player) =>
        byes.indexOf(player.id) === -1 &&
        !boards.find((board) => board.playerIds.indexOf(player.id) !== -1)
    )
    .map((player) => player.id);

  return {
    boards,
    byes,
    players,
    unpaired,
  };
};
