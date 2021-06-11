import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Link as MuiLink,
  Paper as MuiPaper,
  Grid as MuiGrid,
} from "@material-ui/core";

import { Alert as MuiAlert } from "@material-ui/lab";

export const Alert = styled(MuiAlert)(spacing);
export const TextField = styled(MuiTextField)(spacing);
export const Button = styled(MuiButton)(spacing);
export const IconButton = styled(MuiIconButton)(spacing);
export const Link = styled(MuiLink)(spacing);
export const Typography = styled(MuiTypography)(spacing);
export const Paper = styled(MuiPaper)(spacing);
export const Grid = styled(MuiGrid)(spacing);
