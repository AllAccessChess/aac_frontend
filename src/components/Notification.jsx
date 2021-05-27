import React from "react";

import { IconButton } from "@material-ui/core";
import { Notifications as AlarmIcon } from "@material-ui/icons";

const Notification = () => {
  return (
    <>
      <IconButton aria-label="notification" color="secondary">
        <AlarmIcon />
      </IconButton>
    </>
  );
};

export default Notification;
