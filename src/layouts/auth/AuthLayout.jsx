import React from "react";

import { Wrapper } from "./styles";

export const AuthLayout = (props) => {
  return <Wrapper container>{props.children}</Wrapper>;
};
