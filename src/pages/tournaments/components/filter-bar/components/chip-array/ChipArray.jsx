import React from "react";

import { CustomChip } from "./styles";

export const ChipArray = (props) => {
  const { filter, setFilter, options } = props;

  return (
    <>
      {filter.map((value) => (
        <CustomChip
          key={value}
          label={options.find((item) => item.value === value).label}
          color="primary"
          mr={2}
          onDelete={() =>
            setFilter((array) => array.filter((item) => item !== value))
          }
        />
      ))}
    </>
  );
};
