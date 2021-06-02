import React from "react";

import { IconButton } from "components/SpacedMui";
import { Notifications as AlarmIcon } from "@material-ui/icons";

const Notification = () => {
  return (
    <>
      <IconButton aria-label="notification" color="default" mr={2}>
        <AlarmIcon />
      </IconButton>
    </>
  );
};

export default Notification;
