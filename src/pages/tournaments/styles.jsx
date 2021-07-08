import styled from "styled-components";
import { Tab, Tabs } from "components/material-ui";

export const CustomTabs = styled(Tabs)`
  padding-left: 20px;
  margin-bottom: 3px;
`;

export const CustomTab = styled(Tab)`
  background: ${(props) => props.bgcolor};
  border-radius: 5px;
  margin-right: 5px;
`;
