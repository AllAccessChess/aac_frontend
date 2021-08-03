import React from "react";
import { ChevronRight as ChevronRightIcon } from "@material-ui/icons";

import { Box, Typography } from "components/material-ui";

import { Wrapper, TextLabel } from "./styles";

export const Block = (props) => {
  const { title, description, url } = props;

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(url);
    }
  };

  return (
    <Wrapper onClick={handleClick}>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexGrow={1}
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h6">{title}</Typography>
          <ChevronRightIcon />
        </Box>
        <TextLabel>{description}</TextLabel>
      </Box>
    </Wrapper>
  );
};
