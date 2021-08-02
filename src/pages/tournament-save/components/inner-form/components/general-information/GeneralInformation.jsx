import React, { useEffect } from "react";

import {
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "components/material-ui";
import {
  StepNumber,
  SmallTextField,
  SmallHelpIcon,
  OutlinedKeyboardTimePicker,
  OutlinedKeyboardDatePicker,
} from "components/common";
import { CustomAccordion, CustomAccordionDetails } from "./styles";

export const GeneralInformation = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    active,
    verified,
    onNext,
    onOpen,
    onVerify,
  } = props;
  console.log(errors);

  useEffect(() => {
    onVerify(!errors.title && !errors.organiser && !errors.start);
    // eslint-disable-next-line
  }, [errors.title, errors.organiser, errors.start]);

  return (
    <CustomAccordion
      expanded={active}
      bordercolor={active ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={onOpen}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber
              step={1}
              active={active}
              verified={verified[0]}
              mr={2}
            />
            <Typography>General Information</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Lets get started with adding a name and description to your
            tournament
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4} width="100%">
          <Box my={3} width="50%">
            <Box display="flex" alignItems="center">
              <Typography variant="body1" color="textSecondary">
                Tournament Name
              </Typography>
              <SmallHelpIcon />
            </Box>
            <SmallTextField
              type="text"
              name="title"
              variant="outlined"
              color="secondary"
              placeholder="Enter Name"
              value={values.title}
              error={Boolean(touched.title && errors.title)}
              fullWidth
              helperText={touched.title && errors.title}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Box>
          <Box my={3} width="50%">
            <Box display="flex" alignItems="center">
              <Typography variant="body1" color="textSecondary">
                Organiser Name
              </Typography>
              <SmallHelpIcon />
            </Box>
            <SmallTextField
              type="text"
              name="organiser"
              variant="outlined"
              color="secondary"
              placeholder="Enter Name"
              value={values.organiser}
              error={Boolean(touched.organiser && errors.organiser)}
              fullWidth
              helperText={touched.organiser && errors.organiser}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Box>
          <Box my={3} width="50%">
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Tournament Start Date
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <OutlinedKeyboardDatePicker
                  variant="inline"
                  color="secondary"
                  placeholder="Select Date"
                  format="MM/dd/yyyy"
                  value={values.start > 0 ? new Date(values.start) : null}
                  fullWidth
                  onChange={(date) =>
                    setFieldValue("start", new Date(date).getTime())
                  }
                />
              </Grid>

              <Grid item sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary">
                    Tournament Start Time
                  </Typography>
                  <SmallHelpIcon />
                </Box>
                <OutlinedKeyboardTimePicker
                  variant="inline"
                  placeholder="Select Time"
                  fullWidth
                  value={values.start > 0 ? new Date(values.start) : null}
                  onChange={(date) =>
                    setFieldValue("start", new Date(date).getTime())
                  }
                />
              </Grid>
            </Grid>
          </Box>
          {verified[0] ? (
            <Box width="150px">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onNext}
              >
                Next
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </CustomAccordionDetails>
    </CustomAccordion>
  );
};
