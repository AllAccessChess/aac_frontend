import React from "react";

import { CircularProgress } from "components/material-ui";
import { SpinnerWrapper } from "./styles";

export const Spinner = () => {
  return (
    <SpinnerWrapper>
      <CircularProgress m={2} color="secondary" />
    </SpinnerWrapper>
  );
};
