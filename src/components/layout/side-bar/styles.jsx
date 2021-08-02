import styled from "styled-components";

import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "components/material-ui";

export const CustomListItem = styled(ListItem)`
  border-left: 0.5rem solid transparent;
  height: 60px;
  padding: 0;

  &.Mui-selected {
    border-color: ${(props) => props.theme.palette.primary.main};
    background: transparent;
  }
`;

export const CustomListItemIcon = styled(ListItemIcon)`
  min-width: inherit;
  margin: 0 1rem;
`;

export const CustomListItemText = styled(ListItemText)`
  margin: 0 3rem 0 1rem;
`;

export const ToggleButton = styled(Button)`
  background: ${(props) => props.theme.palette.background.default};
  min-width: inherit;
`;
