import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  backDrop: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.3)",
    zIndex: 98,
  },
  wrapper: {
    position: "fixed",
    bottom: theme.spacing(24),
    right: theme.spacing(8),
    width: 400,
    zIndex: 99,
  },
  chatBox: {
    height: "50vh",
    overflowY: "auto",
  },
  sender: {
    fontWeight: 600,
  },
  textField: {
    width: "100%",
  },
}));
