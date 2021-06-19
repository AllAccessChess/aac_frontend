import React from "react";
import { useSelector } from "react-redux";

import { withWidth } from "@material-ui/core";

import { SideBar, TopBar } from "components/layout";
import { Box } from "components/material-ui";
import { authSelector } from "redux/reducers";
import { Wrapper } from "./styles";

const Layout = (props) => {
  const { user } = useSelector(authSelector);

  return (
    <Wrapper>
      <TopBar user={user} />
      <Box display="flex" mx="5%" my="20px">
        <SideBar user={user} routes={props.routes} />
        <Box display="flex" width="100%">
          {props.children}
        </Box>
      </Box>
    </Wrapper>
  );
};

export const MainLayout = withWidth()(Layout);
