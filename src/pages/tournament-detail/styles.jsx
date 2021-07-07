import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    zIndex: 99,
  },
}));
