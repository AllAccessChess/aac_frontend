import styled from "styled-components";
import { Button, Chip } from "components/material-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutlinedDatePicker } from "components/common";

export const CustomIcon = styled(FontAwesomeIcon)`
  background: #ffffff1a;
  width: 2.5rem !important;
  height: 2.5rem !important;
  padding: 10px;
  margin-right: 15px;
`;

export const ClearButton = styled(Button)`
  border-radius: 20px;
`;

export const CustomChip = styled(Chip)`
  border-radius: 20px;
`;

export const CustomDatePicker = styled(OutlinedDatePicker)`
  width: 130px;
  .MuiInputBase-root::before {
    position: absolute;
    top: 45%;
    left: 80%;
    width: 0;
    height: 0;
    display: block;
    opacity: 1;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    border-bottom: 0px !important;
}
  }
`;
