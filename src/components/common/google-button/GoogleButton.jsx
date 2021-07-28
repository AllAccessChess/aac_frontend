import React from "react";

import { CustomButton, SmallImg } from "./styles";

import GoogleIcon from "assets/icons/google-icon.svg";

export const GoogleButton = (props) => (
  <CustomButton
    variant="contained"
    startIcon={<SmallImg src={GoogleIcon} />}
    {...props}
  />
);
