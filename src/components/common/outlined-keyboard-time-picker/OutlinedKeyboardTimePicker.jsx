import styled from "styled-components";

import { KeyboardTimePicker } from "@material-ui/pickers";

export const OutlinedKeyboardTimePicker = styled(KeyboardTimePicker)`
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
    .MuiInputBase-input::-webkit-input-placeholder {
      font-weight: 400 !important;
      color: #b8c6d6 !important;
      opacity: 1 !important;
    }
  }
`;
