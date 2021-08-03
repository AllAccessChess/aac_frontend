import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { withWidth } from "@material-ui/core";
import { ChevronLeft as BackIcon } from "@material-ui/icons";

import { Box, Button } from "components/material-ui";
import { TopBar } from "components/layout";
import { withNotification } from "components/hoc";
import { Wrapper } from "./styles";

const MainBody = (props) => {
  const history = useHistory();

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      position="relative"
    >
      <Box my={3}>
        <Button startIcon={<BackIcon />} onClick={handleBack}>
          Go Back
        </Button>
      </Box>

      <Box display="flex" flexGrow={1} width="100%">
        {props.children}
      </Box>
    </Box>
  );
};

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
        p={5}
        height="calc(100vh - 5rem)"
        overflow="auto"
      >
        <MainBodyWithNotification {...props} />
      </Box>
    </Wrapper>
  );
};

export const DetailLayout = withWidth()(Layout);
