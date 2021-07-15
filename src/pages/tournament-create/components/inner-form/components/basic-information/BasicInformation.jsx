import React, { useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Typography,
} from "components/material-ui";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

export const BasicInformation = (props) => {
  const { errors, handleBlur, handleChange, touched, values } = props;
  const [expanded, setExpanded] = useState(true);
  console.log(errors);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Basic Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <TextField
            type="text"
            name="title"
            label="Tournament Name"
            variant="outlined"
            color="secondary"
            value={values.title}
            error={Boolean(touched.title && errors.title)}
            fullWidth
            helperText={touched.title && errors.title}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="organiser"
            label="Organiser"
            variant="outlined"
            color="secondary"
            value={values.organiser}
            error={Boolean(touched.organiser && errors.organiser)}
            fullWidth
            helperText={touched.organiser && errors.organiser}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
