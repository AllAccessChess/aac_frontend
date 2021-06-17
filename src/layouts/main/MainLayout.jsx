import React from "react";
import { useSelector } from "react-redux";

import { withWidth } from "@material-ui/core";

import { SideBar, TopBar } from "components/layout";
import { Box } from "components/material-ui";
import { authSelector } from "redux/reducers";
import { Wrapper, Container } from "./styles";

const Layout = (props) => {
  const { user } = useSelector(authSelector);

  return (
    <Wrapper>
      <TopBar user={user} />
      <Box display="flex" mx="5%" my="20px">
        <SideBar user={user} routes={props.routes} />
        <Container display="flex" p={5} width="100%">
          {props.children}
        </Container>
      </Box>
    </Wrapper>
  );
};

export const MainLayout = withWidth()(Layout);
