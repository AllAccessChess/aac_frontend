import styled from "styled-components";
import { AppBar } from "components/material-ui";

export const Wrapper = styled(AppBar)`
  background: url(${(props) => props.background});
  background-size: cover;
  padding: 20px 5%;
`;

export const Logo = styled.img`
  width: 113px;
`;
