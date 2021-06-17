import React from "react";
import styled from "styled-components";

import { CircularProgress } from "components/material-ui";

const Wrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 60px;
`;

export const Spinner = () => {
  return (
    <Wrapper>
      <CircularProgress m={2} color="secondary" />
    </Wrapper>
  );
};
