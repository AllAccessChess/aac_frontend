import React, { useEffect } from "react";

import {
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "components/material-ui";
import { StepNumber, SmallTextField, SmallHelpIcon } from "components/common";
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
    dirty,
    onVerify,
  } = props;
  console.log(errors);

  useEffect(() => {
    onVerify(dirty && !errors.title && !errors.organiser && !errors.start);
    // eslint-disable-next-line
  }, [errors.title, errors.organiser, errors.start, dirty]);

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
            <Box display="flex" alignItems="center">
              <Typography variant="body1" color="textSecondary">
                Tournament Start Date Time
              </Typography>
              <SmallHelpIcon />
            </Box>
            <SmallTextField
              type="datetime-local"
              name="start"
              variant="outlined"
              color="secondary"
              placeholder="Select Date Time"
              value={
                values.start > 0
                  ? new Date(values.start).toISOString().replace("Z", "")
                  : ""
              }
              error={Boolean(touched.start && errors.start)}
              fullWidth
              helperText={touched.start && errors.start}
              onBlur={handleBlur}
              onChange={(event) =>
                setFieldValue("start", new Date(event.target.value).getTime())
              }
            />
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
