import React from "react";
import { useSelector } from "react-redux";

import { withWidth } from "@material-ui/core";

import { SideBar, TopBar } from "components/layout";
import { withNotification } from "components/hoc";
import { Box } from "components/material-ui";
import { authSelector } from "redux/reducers";
import { Wrapper } from "./styles";

const Main = (props) => (
  <Box display="flex" mt="5rem" height="calc(100vh - 5rem)">
    <SideBar user={props.user} routes={props.routes} />
    <Box display="flex" flexGrow={1} p={5}>
      {props.children}
    </Box>
  </Box>
);

const MainWithNotification = withNotification(Main);

const Layout = (props) => {
  const { user } = useSelector(authSelector);

  return (
    <Wrapper>
      <TopBar user={user} /> {/* Topbar is 127px in height */}
      <MainWithNotification {...props} user={user} />
    </Wrapper>
  );
};

export const MainLayout = withWidth()(Layout);
