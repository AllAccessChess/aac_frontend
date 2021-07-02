import styled from "styled-components";
import { Accordion, Typography } from "components/material-ui";
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";

export const CustomAccordion = styled(Accordion)`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 0px;
  &.MuiAccordion-root::before {
    height: 0;
  }
`;

export const ByeCell = styled(Typography)`
  padding: 3px 12px;
  margin-right: 8px;
  border-radius: 3px;
  cursor: pointer;
  color: ${(props) =>
    props.state === "active" ? "white" : "rgba(255, 255, 255, 0.7)"};
  border: 3px inset transparent;
  border-bottom: ${(props) =>
    props.state === "active" ? "3px inset #62ae00" : "3px inset transparent"};
  background: #15375c;
`;

export const SmallInfoIcon = styled(InfoIcon)`
  width: 0.7em;
  height: 0.7em;
`;

export const CustomExpandMoreIcon = styled(ExpandMoreIcon)`
  margin-right: 8px;
  margin-left: 8px;
`;
