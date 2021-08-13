import React from "react";
import { useSelector } from "react-redux";

import { withWidth } from "@material-ui/core";

import { SideBar, TopBar } from "components/layout";
import { withNotification } from "components/hoc";
import { Box } from "components/material-ui";
import { authSelector } from "redux/reducers";
import { Wrapper, Container } from "./styles";

const Main = (props) => (
  <Box display="flex" flexGrow={1}>
    {props.children}
  </Box>
);

const MainWithNotification = withNotification(Main);

const Layout = (props) => {
  const { user } = useSelector(authSelector);
  const { sidebarCollapsed } = useSelector((state) => state.themeReducer);

  return (
    <Wrapper>
      <TopBar user={user} />
      <Box
        display="flex"
        mt="5rem"
        width="100%"
        height="calc(100vh - 5rem)"
        position="relative"
      >
        <SideBar
          user={user}
          routes={props.routes}
          sidebarCollapsed={sidebarCollapsed}
        />
        <Container
          flexGrow={1}
          display="flex"
          flexDirection="column"
          height="100%"
          p={5}
          id="mainlayout-wrapper"
        >
          <MainWithNotification {...props} />
        </Container>
      </Box>
    </Wrapper>
  );
};

export const MainLayout = withWidth()(Layout);
