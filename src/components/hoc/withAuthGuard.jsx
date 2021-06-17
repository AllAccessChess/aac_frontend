import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { LoadingScreen } from "components/common";
import { authSelector } from "redux/reducers";
import { signInWithToken } from "redux/reducers/authReducer";

// For routes that can only be accessed by authenticated users
export const withAuthGuard = (Component, redirectToSignIn = false) => (
  props
) => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const history = useHistory();

  useEffect(() => {
    if (!auth.user) {
      dispatch(
        signInWithToken(true, null, () => {
          if (redirectToSignIn) {
            history.push("/auth/sign-in");
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return auth.loading ? <LoadingScreen /> : <Component {...props} />;
};
