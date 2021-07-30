import React from "react";

import { Bar, Indicator, Wrapper } from "./styles";

export const Progress = (props) => {
  const { score } = props;

  const pLength = Math.max(
    Math.min(((parseFloat(score) || 0) + 10) / 20, 1),
    0
  );

  return (
    <Wrapper>
      <Bar width={pLength} />
      <Indicator />
    </Wrapper>
  );
};
