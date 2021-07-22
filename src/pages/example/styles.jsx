import styled from "styled-components";
import { Box } from "components/material-ui";

export const BackgroundWrapper = styled(Box)`
  background: url(${(props) => props.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;
