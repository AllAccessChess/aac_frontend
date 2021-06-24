import React from "react";

import { InputLabel, Select } from "components/material-ui";
import { CustomFormControl } from "./styles";

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
