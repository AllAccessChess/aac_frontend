import merge from "deepmerge";
import { green, grey, blue } from "@material-ui/core/colors";
import { THEMES } from "constant";

const customBlue = {
  primary: "#0366d0",
  light: "#5e93ff",
  dark: "#003d9e",
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    type: "light",
    primary: {
      main: customBlue["primary"],
      contrastText: "#FFF",
    },
    secondary: {
      main: "#f48fb1",
      contrastText: "#FFF",
    },
    background: {
      default: "#E7EBEE",
      paper: "#FFF",
    },
    text: {
      primary: "#FFF",
      secondary: "#8A8A8A",
    },
  },
  header: {
    color: grey[500],
    background: "#FFF",
    search: {
      color: grey[800],
    },
    indicator: {
      background: blue[600],
    },
  },
  footer: {
    color: grey[500],
    background: "#FFF",
  },
  sidebar: {
    color: grey[200],
    background: "#233044",
    header: {
      color: grey[200],
      background: "#233044",
      brand: {
        color: blue[500],
      },
    },
    footer: {
      color: grey[200],
      background: "#1E2A38",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#FFF",
      background: blue[500],
    },
  },
};

const blueVariant = merge(defaultVariant, {
  name: THEMES.BLUE,
  palette: {
    type: "dark",
    primary: {
      main: "#134378",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#F7B500",
      contrastText: "#15375C",
    },
    background: {
      default: "#15375C",
      paper: "#134378",
    },
    text: {
      primary: "#FFF",
      secondary: "#B8C6D6",
    },
  },
  sidebar: {
    color: "#000",
    background: "#000",
    header: {
      color: "#000",
      background: "#FFF",
      brand: {
        color: "#000",
      },
    },
    footer: {
      color: "#000",
      background: "#FFF",
      online: {
        background: "#000",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const variants = [defaultVariant, blueVariant];

export default variants;
