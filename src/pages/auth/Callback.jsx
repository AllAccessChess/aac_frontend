import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";
import { useHistory } from "react-router";

import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button, Typography } from "components/common/SpacedMui";
import ScreenLoader from "components/common/ScreenLoader";

import { signInWithToken } from "redux/reducers/authReducer";
// import { showWarning } from "redux/reducers/messageReducer";
import StorageService from "services/storageService";

function Callback() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState();
  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const expiry = url.searchParams.get("expiry");
    const errorMsg = url.searchParams.get("error");
    // const warnings = url.searchParams.get("warnings");
    if (errorMsg) {
      setError(errorMsg);
    } else if (!token || !expiry) {
      setError("Invalid URL");
    } else {
      // for (let warn of warnings) {
      //   dispatch(showWarning(warn));
      // }
      StorageService.setAuthToken({
        token: token,
        expiry: expiry,
      });
      dispatch(signInWithToken(false, null, setError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.id) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Helmet title="Sign In" />
      {error ? (
        <>
          <Typography component="h1" variant="h1" align="center" gutterBottom>
            Error
          </Typography>
          <Typography
            component="h2"
            variant="body1"
            align="center"
            gutterBottom
          >
            {error}
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            color="secondary"
            mt={2}
          >
            Return to website
          </Button>
        </>
      ) : (
        <ScreenLoader />
      )}
    </Box>
  );
}

export default Callback;
