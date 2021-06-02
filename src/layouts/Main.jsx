import React from "react";
import { useSelector } from "react-redux";

import styled, { createGlobalStyle } from "styled-components/macro";
import { CssBaseline, withWidth, Box } from "@material-ui/core";
import ScreenLoader from "components/ScreenLoader";
import TopBar from "components/TopBar";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
`;
const Wrapper = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.paper};
`;

const Main = ({ children, routes, width }) => {
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const authLoading = useSelector((state) => state.authReducer.loading);

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <TopBar user={user} />
      <Wrapper
        display="flex"
        justifyContent="center"
        mx="calc(5% + 15px)"
        height="calc(100% - 142px)"
      >
        {authLoading ? <ScreenLoader /> : children}
      </Wrapper>
    </Root>
  );
};

export default withWidth()(Main);
