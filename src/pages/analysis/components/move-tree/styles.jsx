import styled from "styled-components";

import { Box } from "components/material-ui";

export const MoveListRow = styled(Box)`
  display: flex;
  align-items: center;
  position: relative;
`;

export const MoveListIndex = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background: ${(props) => props.theme.palette.background.paper};
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  width: 20%;
`;

export const MoveListCell = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 40%;
  padding: 0.5rem 1rem;

  &.active,
  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.palette.background.paper};
  }
`;
