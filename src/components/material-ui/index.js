import styled from "styled-components";
import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Link as MuiLink,
  Paper as MuiPaper,
  Grid as MuiGrid,
  Select as MuiSelect,
  Chip as MuiChip,
} from "@material-ui/core";
import {
  Alert as MuiAlert,
  Autocomplete as MuiAutocomplete,
} from "@material-ui/lab";
import { spacing } from "@material-ui/system";

export * from "@material-ui/core";

export const Alert = styled(MuiAlert)(spacing);
export const Autocomplete = styled(MuiAutocomplete)(spacing);
export const Button = styled(MuiButton)(spacing);
export const Chip = styled(MuiChip)(spacing);
export const IconButton = styled(MuiIconButton)(spacing);
export const Grid = styled(MuiGrid)(spacing);
export const Link = styled(MuiLink)(spacing);
export const Paper = styled(styled(MuiPaper)(spacing))`
  border-radius: 8px;
`;
export const Select = styled(MuiSelect)(spacing);
export const TextField = styled(MuiTextField)(spacing);
export const Typography = styled(MuiTypography)(spacing);
