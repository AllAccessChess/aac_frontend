import React from "react";

import { CustomButton, SmallImg } from "./styles";

import LichessIcon from "assets/icons/lichess-icon.svg";

export const LichessButton = (props) => (
  <CustomButton
    variant="contained"
    startIcon={<SmallImg src={LichessIcon} />}
    {...props}
  />
);
