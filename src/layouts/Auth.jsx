import React from "react";
import styled, { createGlobalStyle } from "styled-components/macro";

import { Link as RouterLink } from "react-router-dom";
import { CssBaseline, Box } from "@material-ui/core";
import { Link } from "components/SpacedMui";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/background.svg";

const Logo = styled.img`
  width: 290px;
`;

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

const Wrapper = styled(Box)`
  background: url(${(props) => props.background});
  background-size: cover;
  background-repeat: no-repeat;
`;

const Auth = ({ children }) => {
  return (
    <Wrapper
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      background={backgroundImg}
    >
      <CssBaseline />
      <GlobalStyle />
      <Box
        position="absolute"
        left="5%"
        top="20px"
        display="flex"
        flexDirection="column"
      >
        <Link component={RouterLink} to="/">
          <Logo src={logoImg} />
        </Link>
        {children}
      </Box>
    </Wrapper>
  );
};

export default Auth;
