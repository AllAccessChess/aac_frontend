import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { useTheme } from "@material-ui/core";
import { Box, Typography } from "components/material-ui";
import { SwitchField } from "./components";
import { updateMe } from "redux/reducers/authReducer";

const switchableSettings = [
  {
    title: "Promote to Queen Automatically",
    description: "Promote to Queen Automatically in game",
    field: "autoPromote",
  },
  {
    title: "Input Moves with Keyboard",
    description: "Input Moves with Keyboard in game",
    field: "keyboardMoves",
  },
  {
    title: "Kid Mode",
    description:
      "We will disable chat and video sharing for kids, if you feel they should not be visible please enable this setting",
    field: "kidMode",
  },
  {
    title: "Enable Premoves",
    description: "Enable Premoves in game",
    field: "enablePremoves",
  },
];

export const Settings = () => {
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [userSettings, setUserSettings] = useState(user.settings);

  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, [history, user]);

  const handleSettingsChange = (field, value) => {
    setUserSettings({
      ...userSettings,
      [field]: value,
    });
    dispatch(
      updateMe({
        ...user,
        settings: {
          ...user.settings,
          [field]: value,
        },
      })
    );
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      bgcolor={theme.palette.background.paper}
    >
      <Helmet title="Settings" />
      <Typography variant="h3" mb={5}>
        Settings
      </Typography>

      <Box pr={4} overflow="auto">
        {switchableSettings.map((item, index) => (
          <SwitchField
            key={index}
            title={item.title}
            description={item.description}
            value={userSettings[item.field]}
            onChange={(value) => handleSettingsChange(item.field, value)}
          />
        ))}
      </Box>
    </Box>
  );
};
