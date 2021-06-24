import styled from "styled-components";
import { Paper } from "components/material-ui";
import { Typography } from "components/material-ui";

export const Block = styled(Paper)`
  margin: 1rem;
  padding: 1rem;
`;
export const TextLabel = styled(Typography)`
  opacity: 0.3;
`;

export const TextHelper = styled(TextLabel)`
  font-style: italic;
`;
