import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled, { createGlobalStyle } from "styled-components/macro";
import { CssBaseline, withWidth, Box } from "@material-ui/core";
import ScreenLoader from "components/common/ScreenLoader";
import TopBar from "components/common/TopBar";
import SideBar from "components/common/SideBar";

import { signInWithToken } from "redux/reducers/authReducer";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
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
  border-radius: 10px;
`;

const Main = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const authLoading = useSelector((state) => state.authReducer.loading);

  useEffect(() => {
    if (!user) {
      dispatch(signInWithToken());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <TopBar user={user} />
      <Box display="flex" mx="5%" my="20px">
        <SideBar user={user} />
        <Wrapper display="flex" p={5} width="100%">
          {authLoading ? <ScreenLoader /> : children}
        </Wrapper>
      </Box>
    </Root>
  );
};

export default withWidth()(Main);
