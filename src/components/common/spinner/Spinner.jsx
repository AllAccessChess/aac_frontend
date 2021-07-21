import React from "react";

import { CircularProgress } from "components/material-ui";
import { SpinnerWrapper } from "./styles";

export const Spinner = (props) => {
  return (
    <SpinnerWrapper {...props}>
      <CircularProgress m={2} color="secondary" {...props} />
    </SpinnerWrapper>
  );
};
