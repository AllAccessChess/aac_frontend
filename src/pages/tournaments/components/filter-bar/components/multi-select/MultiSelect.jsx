import React from "react";

import { MenuItem, Checkbox, Box } from "components/material-ui";

import { CustomSelect, SmallTypography } from "./styles";

export const MultiSelect = ({
  options,
  placeholder,
  value,
  displayEmpty,
  ...props
}) => {
  return (
    <CustomSelect
      displayEmpty={displayEmpty}
      value={value}
      multiple
      {...props}
      renderValue={(selected) => {
        return (
          <>
            <SmallTypography color="textSecondary" mr={5}>
              {placeholder}
            </SmallTypography>
            {value && value.length ? (
              <Box
                width="6px"
                height="6px"
                left="5px"
                top="5px"
                position="absolute"
                borderRadius="100%"
                bgcolor="#F7B500"
              ></Box>
            ) : (
              <></>
            )}
          </>
        );
      }}
    >
      {options.map((item, index) => (
        <MenuItem value={item.value} key={index}>
          <Checkbox checked={value && value.indexOf(item.value) > -1} />
          <SmallTypography>{item.label}</SmallTypography>
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
