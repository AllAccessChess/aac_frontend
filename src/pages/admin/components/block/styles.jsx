import styled from "styled-components";
import { Box, Typography } from "components/material-ui";

export const Wrapper = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 1rem;
`;

export const TextLabel = styled(Typography)`
  opacity: 0.3;
`;
