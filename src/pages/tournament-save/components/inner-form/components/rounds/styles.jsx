import styled from "styled-components";

import {
  Accordion,
  AccordionDetails,
  Select,
  TextField,
} from "components/material-ui";

export const CustomAccordion = styled(Accordion)`
  border: 2px solid ${(props) => props.bordercolor};
  border-radius: 10px !important;
  margin-bottom: 10px;
`;

export const CustomAccordionDetails = styled(AccordionDetails)`
  border-top: 2px solid rgba(255, 255, 255, 0.3);
`;

export const CustomSelect = styled(Select)`
  .MuiInputBase-input {
    padding: 10px 14px;
  }
`;

export const TimeField = styled(TextField)`
  .MuiInputBase-input {
    padding: 11px 14px;
  }
`;
