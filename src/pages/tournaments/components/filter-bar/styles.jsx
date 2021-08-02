import styled from "styled-components";
import { Button, Chip } from "components/material-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CustomIcon = styled(FontAwesomeIcon)`
  background: #ffffff1a;
  width: 2em !important;
  height: 3em !important;
  padding: 0px 5px;
  margin-right: 15px;
`;

export const ClearButton = styled(Button)`
  border-radius: 20px;
`;

export const CustomChip = styled(Chip)`
  border-radius: 20px;
`;
