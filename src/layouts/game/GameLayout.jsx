import React from "react";
import { withWidth } from "@material-ui/core";

import { Wrapper } from "./styles";

const Layout = (props) => {
  return <Wrapper>{props.children}</Wrapper>;
};

export const GameLayout = withWidth()(Layout);
