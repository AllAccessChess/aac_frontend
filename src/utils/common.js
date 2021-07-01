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
  if (remaining > 1000 * 60 * 60) {
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
