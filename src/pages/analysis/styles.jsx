import styled from "styled-components";

import { Box, Typography } from "components/material-ui";

export const MoveTreeWrapper = styled(Box)`
  border-radius: 0.5rem;
  background: ${(props) => props.theme.palette.background.default};
  border: 1px solid ${(props) => props.theme.palette.background.default};
  overflow: hidden;
  width: 25rem;
`;

export const MoveTreeHeader = styled(Box)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  background: ${(props) => props.theme.palette.background.paper};
`;

export const PossibleMovesText = styled(Typography)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
