import { makeStyles, withStyles } from "@material-ui/core/styles";

import { TextField } from "components/material-ui";

export const MessageField = withStyles((theme) => ({
  root: {
    width: "100%",
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(3),
    },
  },
}))(TextField);

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.background.default,
    borderTopLeftRadius: theme.spacing(4),
    borderTopRightRadius: theme.spacing(4),
    boxShadow: "0px 0px 12px 12px rgb(0 0 0 / 30%)",
    position: "fixed",
    bottom: 0,
    right: 120,
    width: 480,
    zIndex: 99,
  },
  titleBar: {
    cursor: "pointer",
  },
  chatBox: {
    background: "#0A2747",
    height: "50vh",
    overflowY: "auto",
  },
  sender: {
    fontWeight: 600,
  },
  textField: {
    width: "100%",
  },
  onlineIndicator: {
    backgroundColor: "green",
  },
  offlineIndicator: {
    backgroundColor: "grey",
  },
}));
