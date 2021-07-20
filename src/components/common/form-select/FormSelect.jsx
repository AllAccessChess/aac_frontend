import React from "react";

import { MenuItem, FormControl, FormHelperText } from "components/material-ui";

import { CustomSelect, SmallTypography } from "./styles";

export const FormSelect = ({ options, placeholder, error, ...props }) => {
  return (
    <FormControl error={error} {...props}>
      <CustomSelect
        {...props}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <SmallTypography color="textSecondary">
                {placeholder}
              </SmallTypography>
            );
          }
          return options.find((item) => item.value === selected).label;
        }}
      >
        {options.map((item, index) => (
          <MenuItem value={item.value} key={index}>
            {item.label}
          </MenuItem>
        ))}
      </CustomSelect>
      {error ? <FormHelperText>{error}</FormHelperText> : <></>}
    </FormControl>
  );
};
