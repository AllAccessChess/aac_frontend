import React from "react";
import styled from "styled-components/macro";

import { Button } from "./SpacedMui";
import LichessIcon from "assets/icons/lichess-icon.svg";

const CustomButton = styled(Button)`
  .MuiButton-startIcon {
    position: absolute;
    left: 20px;
  }
`;
const SmallImg = styled.img`
  width: 32px;
`;

export const LichessButton = (props) => (
  <CustomButton
    variant="contained"
    startIcon={<SmallImg src={LichessIcon} />}
    {...props}
  />
);
