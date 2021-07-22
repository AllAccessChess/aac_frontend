import styled from "styled-components";

import { Box } from "components/material-ui";

export const Wrapper = styled(Box)`
  width: 300px;
  height: 60vh;
  overflow-y: auto;
  background: ${(props) => props.theme.palette.background.default};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

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

export const SubTreeWrapper = styled(Box)`
  padding: 0.5rem;
  background: ${(props) => props.theme.palette.background.paper};
  border-left: ${(props) =>
    props.root === "true" ? "1px solid rgba(255, 255, 255, 0.2)" : "none"};

  &::before {
    content: "";
    display: ${(props) => (props.root === "true" ? "none" : "block")};
    width: 1px;
    height: 1.25rem;
    position: absolute;
    top: 0.75rem;
    background: white;
  }
`;

export const SubTree = styled(Box)`
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 1px solid white;
`;

export const SubTreeMain = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 1rem;
  line-height: 1.5rem;

  &::before {
    content: "";
    width: 1rem;
    height: 1px;
    position: absolute;
    left: 0;
    background: white;
  }
`;

export const SubTreeMainIndex = styled(Box)`
  margin-left: 0.25rem;
`;

export const SubTreeCell = styled(Box)`
  margin-right: ${(props) => (props.even === "true" ? "0.25rem" : 0)};
  padding: 0 0.25rem;

  &.active,
  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.3);
  }
`;
