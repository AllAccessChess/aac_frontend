import styled from "styled-components";
import { AppBar } from "components/material-ui";

export const Wrapper = styled(AppBar)`
  background: url(${(props) => props.background});
  background-size: cover;
  position: fixed;
  height: 5rem;
  display: flex;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 113px;
`;
