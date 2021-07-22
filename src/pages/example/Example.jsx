import React from "react";
import { Helmet } from "react-helmet";
import { BackgroundWrapper } from "./styles";

import example1 from "assets/images/example1.jpg";

export const Example = () => {
  return (
    <>
      <Helmet title="Example" />
      <BackgroundWrapper
        width="100%"
        height="100%"
        background={example1}
      ></BackgroundWrapper>
    </>
  );
};
