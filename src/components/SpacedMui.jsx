import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import {
  Button as MuiButton,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Link as MuiLink,
} from "@material-ui/core";

import { Alert as MuiAlert } from "@material-ui/lab";

export const Alert = styled(MuiAlert)(spacing);
export const TextField = styled(MuiTextField)(spacing);
export const Button = styled(MuiButton)(spacing);
export const Link = styled(MuiLink)(spacing);
export const Typography = styled(MuiTypography)(spacing);
