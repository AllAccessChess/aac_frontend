import { createGlobalStyle } from "styled-components";

export const AppGlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }
  body {
    background: ${(props) => props.theme.palette.background.default};
  }
`;
