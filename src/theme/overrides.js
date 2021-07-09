const overrides = {
  MuiCssBaseline: {
    "@global": {
      html: {
        WebkitFontSmoothing: "auto",
      },
      "::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 5px #0f0f0f",
        backgroundColor: "#202121",
      },
      "::-webkit-scrollbar": {
        backgroundColor: "#202121",
      },
      "::-webkit-scrollbar:vertical": {
        width: "10px",
      },
      "::-webkit-scrollbar:horizontal": {
        height: "10px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#37393a",
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "#37393a",
      },
    },
  },
  MuiCard: {
    root: {
      borderRadius: "6px",
      boxShadow:
        "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
    },
  },
  MuiCardHeader: {
    action: {
      marginTop: "-4px",
      marginRight: "-4px",
    },
  },
  MuiPickersDay: {
    day: {
      fontWeight: "300",
    },
  },
  MuiPickersYear: {
    root: {
      height: "64px",
    },
  },
  MuiPickersCalendar: {
    transitionContainer: {
      marginTop: "6px",
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: "transparent",
      "& > *": {
        backgroundColor: "transparent",
      },
    },
    switchHeader: {
      marginTop: "2px",
      marginBottom: "4px",
    },
  },
  MuiPickersClock: {
    container: {
      margin: `32px 0 4px`,
    },
  },
  MuiPickersClockNumber: {
    clockNumber: {
      left: `calc(50% - 16px)`,
      width: "32px",
      height: "32px",
    },
  },
  MuiPickerDTHeader: {
    dateHeader: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
    timeHeader: {
      "& h3": {
        fontSize: "3rem",
        fontWeight: 400,
      },
    },
  },
  MuiPickersTimePicker: {
    hourMinuteLabel: {
      "& h2": {
        fontSize: "3.75rem",
        fontWeight: 300,
      },
    },
  },
  MuiPickersToolbar: {
    toolbar: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
  },
  MuiChip: {
    root: {
      borderRadius: "6px",
    },
  },
  MuiLink: {
    root: {
      cursor: "pointer",
      "&.MuiTypography-colorPrimary": {
        color: "#52A5FF",
      },
    },
  },
  MuiButton: {
    containedSizeLarge: {
      fontSize: "1.0625rem",
      fontWeight: 700,
    },
    textSizeLarge: {
      fontSize: "1.0625rem",
      fontWeight: 700,
    },
  },
  MuiFormHelperText: {
    root: {
      textTransform: "none",
      fontSize: "0.9rem",
    },
  },
  MuiTab: {
    textColorInherit: {
      "&.Mui-selected": {
        fontWeight: 700,
      },
    },
  },
  MuiTableCell: {
    head: {
      "&:first-child": {
        borderRadius: "10px 0 0 10px",
      },
      "&:last-child": {
        borderRadius: "0 10px 10px 0",
      },
    },
    stickyHeader: {
      border: "none",
    },
    body: {
      border: "none",
      paddingTop: "5px",
      paddingBottom: "5px",
    },
  },
};

export default overrides;
