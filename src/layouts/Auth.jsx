import React from "react";
import styled, { createGlobalStyle } from "styled-components/macro";

import { CssBaseline, Grid } from "@material-ui/core";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }
  body {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const Wrapper = styled(Grid)`
  height: 100%;
`;

const Auth = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <GlobalStyle />
      <Wrapper container>{children}</Wrapper>
    </>
  );
};

export default Auth;
