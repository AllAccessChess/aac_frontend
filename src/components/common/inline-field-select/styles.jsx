import styled from "styled-components";
import { FormControl } from "components/material-ui";

export const CustomFormControl = styled(FormControl)`
  width: 180px;
  background: #0366d0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  color: white;
  border-radius: 5px;
  .MuiInputLabel-filled.MuiInputLabel-shrink {
    transform: none;
    color: #ddd;
    position: relative;
  }
  .MuiFilledInput-root {
    background-color: transparent;
  }
  .MuiSelect-filled.MuiSelect-filled {
    padding-top: 10px;
  }
  .MuiFilledInput-underline::before,
  .MuiFilledInput-underline::after {
    display: none;
  }
`;
