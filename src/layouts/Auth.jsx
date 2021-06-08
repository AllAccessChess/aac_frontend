import React from "react";
import styled, { createGlobalStyle } from "styled-components/macro";

import { Link as RouterLink } from "react-router-dom";
import { CssBaseline, Box, Grid, Button } from "@material-ui/core";
import { Link } from "components/common/SpacedMui";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/auth_background.png";

const Logo = styled.img`
  width: 113px;
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

const Wrapper = styled(Grid)`
  height: 100%;
`;
const BackgroundWrapper = styled(Grid)`
  background: url(${(props) => props.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Auth = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <GlobalStyle />
      <Wrapper container>
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" px={10} py={8}>
            <Box display="flex" justifyContent="space-between" mb={5}>
              <Link component={RouterLink} to="/">
                <Logo src={logoImg} />
              </Link>
              <Button
                component={RouterLink}
                to="/"
                color="secondary"
                size="large"
              >
                Continue as a guest
              </Button>
            </Box>
            {children}
          </Box>
        </Grid>
        <BackgroundWrapper
          item
          xs={12}
          sm={6}
          background={backgroundImg}
        ></BackgroundWrapper>
      </Wrapper>
    </>
  );
};

export default Auth;
