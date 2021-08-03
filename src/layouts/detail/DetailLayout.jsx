import React from "react";
import { useSelector } from "react-redux";
import { withWidth } from "@material-ui/core";

import { Box } from "components/material-ui";
import { TopBar } from "components/layout";
import { withNotification } from "components/hoc";
import { Wrapper } from "./styles";

const MainBody = (props) => (
  <Box display="flex" p={5}>
    {props.children}
  </Box>
);

const MainBodyWithNotification = withNotification(MainBody);

const Layout = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <Wrapper>
      <TopBar user={user} />
      <Box
        display="flex"
        flexDirection="column"
        mt="5rem"
        height="calc(100vh - 5rem)"
        overflow="auto"
      >
        <MainBodyWithNotification {...props} />
      </Box>
    </Wrapper>
  );
};

export const DetailLayout = withWidth()(Layout);
