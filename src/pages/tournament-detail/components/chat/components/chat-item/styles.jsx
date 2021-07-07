import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    color: theme.palette.getContrastText(theme.palette.background.paper),
    backgroundColor: theme.palette.background.paper,
  },
  username: {
    margin: theme.spacing(2),
    opacity: 0.5,
  },
  message: {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(2),
    padding: "4px 12px",
  },
}));
