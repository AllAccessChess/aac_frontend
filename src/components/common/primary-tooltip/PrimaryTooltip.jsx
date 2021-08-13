import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export const PrimaryTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    fontWeight: "normal",
  },
  arrow: {
    color: theme.palette.primary.main,
  },
}))(Tooltip);
