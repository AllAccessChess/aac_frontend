import styled from "styled-components";
import { alpha } from "@material-ui/core/styles";

import { Box, IconButton } from "components/material-ui";

export const Wrapper = styled(Box)`
  padding: 1rem 4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 3rem;
  cursor: ${(props) => (props.merged === "true" ? "inherit" : "pointer")};
  width: 100%;
  border-radius: 0.25rem;
  border-bottom-left-radius: ${(props) =>
    props.expanded === "true" ? 0 : "0.25rem"};
  border-bottom-right-radius: ${(props) =>
    props.expanded === "true" ? 0 : "0.25rem"};
`;

export const Container = styled(Box)`
  box-shadow: 0px 0px 8px inset rgba(0, 0, 0, 0.25);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.25rem;
  border-top-left-radius: ${(props) =>
    props.expanded === "true" ? 0 : "0.25rem"};
  border-top-right-radius: ${(props) =>
    props.expanded === "true" ? 0 : "0.25rem"};
  padding: 2rem;
`;

export const Tree = styled(Box)`
  position: absolute;
  height: 100%;
  width: 3rem;
  top: 2.5rem;
  left: 1rem;
  border-left: ${(props) =>
    props.last === "true"
      ? "none"
      : props.merged === "true"
      ? `1px solid ${props.theme.palette.secondary.main}`
      : "1px dashed white"};
  border-top: ${(props) =>
    props.merged === "true" || props.prevMerged === "true"
      ? `1px solid ${props.theme.palette.secondary.main}`
      : "1px dashed white"};
`;

export const TreeButtonWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

export const TreeButton = styled(IconButton)`
  background: ${(props) =>
    props.merged === "true"
      ? props.theme.palette.secondary.main
      : props.theme.palette.primary.main};

  &.MuiIconButton-root:hover {
    background: ${(props) =>
      props.merged === "true"
        ? props.theme.palette.secondary.main
        : props.theme.palette.primary.main};
  }
`;

export const BoardHeader = styled(Box)`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

export const DroppableBox = styled(Box)`
  width: 240px;
  padding: 1rem;
  overflow: hidden;
`;

export const BoardSquare = styled(Box)`
  position: absolute;
  height: 54px;
  width: 100%;
  transform: translate(-16px, calc(-100% + 4px));
  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.palette.secondary.main};
`;

export const DragFocus = styled(Box)`
  position: absolute;
  opacity: ${(props) => (props.dragging === "true" ? 1 : 0)};
  left: 26px;
  top: -4px;
  width: 8px;
  height: 8px;
  background: ${(props) => props.theme.palette.secondary.main};
  border-radius: 8px;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0
        ${(props) => alpha(props.theme.palette.secondary.main, 0.7)};
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px transparent;
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;

export const BoardContainer = styled(Box)`
  display: flex;
  max-height: 400px;
  overflow: auto;
  padding: 1rem;
`;
