import styled from "styled-components";
import { Box } from "components/material-ui";

export const EmptyWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.7);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
`;
