import styled from "styled-components";
import { Grid } from "components/material-ui";

export const Logo = styled.img`
  width: 113px;
`;

export const BackgroundWrapper = styled(Grid)`
  background: url(${(props) => props.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-position-x: 200px;
  background-position-y: bottom;
`;
