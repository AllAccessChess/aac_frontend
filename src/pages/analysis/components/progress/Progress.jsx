import React from "react";

import { Bar, Wrapper } from "./styles";

export const Progress = (props) => {
  const { score } = props;

  const pLength = Math.max(Math.min((score + 50) / 100, 1), 0);

  return (
    <Wrapper>
      <Bar width={pLength} />
    </Wrapper>
  );
};
