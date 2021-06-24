import React from "react";

import { IconButton } from "components/material-ui";
import { Notifications as AlarmIcon } from "@material-ui/icons";

export const Notification = () => {
  return (
    <>
      <IconButton aria-label="notification" color="default" mr={2}>
        <AlarmIcon />
      </IconButton>
    </>
  );
};
