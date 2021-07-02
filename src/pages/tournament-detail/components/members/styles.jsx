import styled from "styled-components";
import { Paper, Typography } from "components/material-ui";

export const CustomPaper = styled(Paper)`
  width: 100%;
`;

export const ByeCell = styled(Typography)`
  padding: 7px 12px;
  margin-right: 8px;
  border-radius: 8px;
  color: ${(props) =>
    props.state === "owneractive" ? "#15375C" : "rgba(255, 255, 255, 0.7)"};
  background: ${(props) =>
    props.state === "owneractive"
      ? "#F7B500"
      : props.state === "active"
      ? "#0366D0"
      : "#15375C"};
  font-weight: ${(props) => (props.state === "owneractive" ? 700 : 400)};
`;

export const NumberCell = styled(Typography)`
  padding: 5px 13px;
  border-radius: 8px;
  color: ${(props) => (props.state === "owner" ? "#15375C" : "white")};
  background: ${(props) => (props.state === "owner" ? "#F7B500" : "none")};
  font-weight: ${(props) => (props.state === "owner" ? 700 : 400)};
`;
