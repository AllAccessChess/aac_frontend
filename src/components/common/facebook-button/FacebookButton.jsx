import React from "react";

import { CustomButton, SmallImg } from "./styles";

import FacebookIcon from "assets/icons/facebook-icon.svg";

export const FacebookButton = (props) => (
  <CustomButton
    variant="contained"
    startIcon={<SmallImg src={FacebookIcon} />}
    {...props}
  />
);
