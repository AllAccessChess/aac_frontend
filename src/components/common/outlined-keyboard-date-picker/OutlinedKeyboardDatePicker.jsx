import styled from "styled-components";

import { KeyboardDatePicker } from "@material-ui/pickers";

export const OutlinedKeyboardDatePicker = styled(KeyboardDatePicker)`
  .MuiInputBase-root {
    border: 1px solid rgba(255, 255, 255, 0.23);
    border-radius: 5px;
    padding: 4px 1px 3px 14px;
    &::before,
    &::after {
      display: none;
    }
    &:hover {
      border: 1px solid rgba(255, 255, 255);
    }
    &.Mui-focused {
      border: 1px solid #f7b500;
    }
    &.Mui-error {
      border: 1px solid #f44336;
    }
  }
`;
