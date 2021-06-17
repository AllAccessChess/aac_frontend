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
      <Box display="flex" mx="5%" my="20px">
        <Box display="flex" p={5} width="100%">
          {props.children}
        </Box>
      </Box>
    </Wrapper>
  );
};

export const DetailLayout = withWidth()(Layout);
