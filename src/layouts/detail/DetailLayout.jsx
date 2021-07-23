import React from "react";
import { useSelector } from "react-redux";
import { withWidth } from "@material-ui/core";

import { Box } from "components/material-ui";
import { TopBar } from "components/layout";
import { withNotification } from "components/hoc";
import { Wrapper } from "./styles";

const MainBody = (props) => (
  <Box
    display="flex"
    px="5%"
    py="20px"
    overflow="auto"
    height="calc(100% - 87px)"
  >
    {props.children}
  </Box>
);

const MainBodyWithNotification = withNotification(MainBody);

const Layout = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <Wrapper>
      <TopBar user={user} />
      <MainBodyWithNotification {...props} />
    </Wrapper>
  );
};

export const DetailLayout = withWidth()(Layout);
