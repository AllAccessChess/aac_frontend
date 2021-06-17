import React from "react";
import { useSelector } from "react-redux";
import { withWidth } from "@material-ui/core";

import { Box } from "components/material-ui";
import { TopBar } from "components/layout";
import { Wrapper } from "./styles";

const Layout = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  return (
    <Wrapper>
      <TopBar user={user} />
      <Box
        display="flex"
        px="5%"
        py="20px"
        overflow="auto"
        height="calc(100% - 87px)"
      >
        {props.children}
      </Box>
    </Wrapper>
  );
};

export const DetailLayout = withWidth()(Layout);
