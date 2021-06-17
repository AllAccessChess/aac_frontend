import { styled } from "@material-ui/core/styles";

import { Box } from "components/material-ui";

export const Wrapper = styled(Box)`
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
`;

export const Container = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.paper};
  border-radius: 10px;
`;
