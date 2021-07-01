import styled from "styled-components";

import { TableCell } from "components/material-ui";

export const HoveralbleCell = styled(TableCell)`
  cursor: pointer;
  background: ${(props) => (props.active ? "#ffffff30" : "none")};
  border-radius: 5px;
`;
