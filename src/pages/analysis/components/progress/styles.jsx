import styled from "styled-components";

import { Box } from "components/material-ui";

export const Wrapper = styled(Box)`
  width: 100%;
  height: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
`;

export const Bar = styled(Box)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(props) => `${props.width * 100}%`};
  background: white;
`;
