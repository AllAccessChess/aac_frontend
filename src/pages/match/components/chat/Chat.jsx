import React from "react";

import { Typography } from "components/material-ui";

export const Chat = (props) => {
  const { message } = props;
  return <Typography color="secondary">{message}</Typography>;
};
