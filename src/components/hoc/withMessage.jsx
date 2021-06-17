import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { setMessage } from "redux/reducers/messageReducer";

export const withMessage = (Component) => (props) => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.messageReducer);

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setMessage({ message: null }));
  };

  return (
    <React.Fragment>
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
      <Component {...props} />
    </React.Fragment>
  );
};
