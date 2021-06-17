import React from "react";
import styled from "styled-components";

import { FormControl, InputLabel, Select } from "components/material-ui";

const CustomFormControl = styled(FormControl)`
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

export const InlineFilledSelect = (props) => {
  const { id, labelId, label, value, onChange, children } = props;
  return (
    <CustomFormControl variant="filled">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} id={id} value={value} onChange={onChange}>
        {children}
      </Select>
    </CustomFormControl>
  );
};
