import merge from "deepmerge";
import { green, grey, indigo, red, blue } from "@material-ui/core/colors";
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

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  palette: {
    type: "dark",
    primary: {
      main: customBlue[200],
      contrastText: "#FFF",
    },
    error: {
      main: red[300],
      contrastText: "#FFF",
    },
    background: {
      default: "#1B2635",
      paper: "#233044",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.5)",
    },
  },
  header: {
    color: grey[300],
    background: "#1B2635",
    search: {
      color: grey[200],
    },
  },
  footer: {
    color: grey[300],
    background: "#233044",
  },
});

const lightVariant = merge(defaultVariant, {
  name: THEMES.LIGHT,
  palette: {
    type: "light",
  },
  header: {
    color: grey[200],
    background: blue[800],
    search: {
      color: grey[100],
    },
    indicator: {
      background: red[700],
    },
  },
  sidebar: {
    color: grey[900],
    background: "#FFF",
    header: {
      color: "#FFF",
      background: blue[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: grey[800],
      background: "#F7F7F7",
      online: {
        background: green[500],
      },
    },
  },
});

const blueVariant = merge(defaultVariant, {
  name: THEMES.BLUE,
  palette: {
    type: "dark",
    primary: {
      main: customBlue["primary"],
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

const greenVariant = merge(defaultVariant, {
  name: THEMES.GREEN,
  palette: {
    primary: {
      main: green[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: green[500],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: green[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: green[700],
    header: {
      color: "#FFF",
      background: green[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: green[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const indigoVariant = merge(defaultVariant, {
  name: THEMES.INDIGO,
  palette: {
    primary: {
      main: indigo[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: indigo[400],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: indigo[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: indigo[700],
    header: {
      color: "#FFF",
      background: indigo[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: indigo[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const variants = [
  defaultVariant,
  darkVariant,
  lightVariant,
  blueVariant,
  greenVariant,
  indigoVariant,
];

export default variants;
