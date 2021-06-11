import React from "react";
import { useParams } from "react-router";
import { Box } from "@material-ui/core";

function Callback() {
  const params = useParams();
  return <Box>Call Back: {params.hash}</Box>;
}

export default Callback;
