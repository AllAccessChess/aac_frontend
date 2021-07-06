import { createGlobalStyle } from "styled-components";

export const AppGlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }
  input[type="text"] {
    outline: none !important;
  }
  input[type="text"]:focus,
  input[type="text"]:active {
    outline: none !important;
  }
`;
