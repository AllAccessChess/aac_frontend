import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import DateFnsUtils from "@date-io/date-fns";

import { ThemeProvider } from "styled-components/macro";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

import createTheme from "./theme";
import Routes from "./routes/Routes";

import { setMessage } from "redux/reducers/messageReducer";
import { ZoomProvider } from "lib/zoom";

function App() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.messageReducer);
  const theme = useSelector((state) => state.themeReducer);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setMessage({ message: null }));
  };

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s | All Access Chess"
        defaultTitle="All Access Chess"
      />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
            <ThemeProvider theme={createTheme(theme.currentTheme)}>
              {message.msg ? (
                <Snackbar
                  open={message.msg ? true : false}
                  autoHideDuration={5000}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Alert onClose={handleClose} severity={message.type}>
                    {message.msg}
                  </Alert>
                </Snackbar>
              ) : (
                <></>
              )}
              <ZoomProvider>
                <Routes />
              </ZoomProvider>
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

export default App;
