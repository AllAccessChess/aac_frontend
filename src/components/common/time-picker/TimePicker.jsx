import clsx from "clsx";
import moment from "moment";
import RCTimePicker from "rc-time-picker";
import React from "react";
import { QueryBuilder as ClockIcon } from "@material-ui/icons";

import { Box, FilledInput, Input, OutlinedInput } from "components/material-ui";

const CustomTimePicker = (props) => {
  const { className, onChange, value, placeholder } = props;

  return (
    <RCTimePicker
      placeholder={placeholder}
      className={className}
      popupClassName={className}
      hideDisabledOptions
      showSecond={false}
      minuteStep={5}
      value={value > 0 ? moment(value) : null}
      onChange={onChange}
      inputIcon={
        <Box display="flex" px={4}>
          <ClockIcon />
        </Box>
      }
    />
  );
};

export const TimePicker = (props) => {
  const { className, variant, value, onChange, ...otherProps } = props;

  const TimePickerInput =
    variant === "outlined"
      ? OutlinedInput
      : variant === "filled"
      ? FilledInput
      : Input;

  return (
    <TimePickerInput
      inputComponent={(props) => (
        <CustomTimePicker
          {...props}
          value={value}
          onChange={onChange}
          className={clsx(className, props.className)}
        />
      )}
      {...otherProps}
    />
  );
};
