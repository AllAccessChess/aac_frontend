import React, { useEffect } from "react";

import {
  AccordionSummary,
  Box,
  Button,
  Typography,
  Grid,
} from "components/material-ui";
import {
  LightBlueTextColorButton,
  PrimaryTooltip,
  PlayerAutoComplete,
  SmallHelpIcon,
  StepNumber,
} from "components/common";
import { CustomAccordion, CustomAccordionDetails } from "./styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import { FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "redux/reducers/userReducer";

export const Restrictions = (props) => {
  const dispatch = useDispatch();
  const {
    errors,
    handleBlur,
    values,
    setFieldValue,
    active,
    verified,
    onOpen,
    onVerify,
  } = props;
  const users = useSelector((state) => state.userReducer.list);

  useEffect(() => {
    onVerify(!errors.restrictions || !errors.restrictions.whitelist);
    // eslint-disable-next-line
  }, [errors.restrictions]);

  useEffect(() => {
    if (!users.length) dispatch(getUserList());
    // eslint-disable-next-line
  }, [users]);

  return (
    <CustomAccordion
      expanded={active}
      bordercolor={active ? "white" : "rgba(255, 255, 255, 0.3)"}
      onChange={verified[0] && verified[1] && verified[2] ? onOpen : null}
    >
      <AccordionSummary>
        <Box px={3}>
          <Box display="flex" alignItems="center">
            <StepNumber
              step={4}
              active={active}
              verified={verified[3]}
              mr={2}
            />
            <Typography>Restrictions</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Setup restrictions on who can participate this tournament
          </Typography>
        </Box>
      </AccordionSummary>
      <CustomAccordionDetails>
        <Box py={2} px={4} width="100%">
          <Box display="flex" alignItems="center">
            <Typography variant="body1">Whitelist</Typography>
            <PrimaryTooltip
              title="Restrict the tournament to a list of specific players"
              arrow
            >
              <SmallHelpIcon />
            </PrimaryTooltip>
          </Box>

          <FieldArray
            name="restrictions.whitelist"
            render={(arrayHelpers) => (
              <Box width="100%">
                <Grid container spacing={5} my={3}>
                  <Grid item sm={1}>
                    <Typography color="textSecondary">No.</Typography>
                  </Grid>
                  <Grid item sm={5}>
                    <Typography color="textSecondary">Name</Typography>
                  </Grid>
                </Grid>
                {values.restrictions.whitelist &&
                  values.restrictions.whitelist.map((player, index) => (
                    <Grid key={index} container spacing={5} my={3}>
                      <Grid item sm={1}>
                        <Typography variant="subtitle1">{index + 1}</Typography>
                      </Grid>
                      <Grid item sm={5}>
                        <PlayerAutoComplete
                          label="Search for player"
                          value={{ id: player }}
                          users={users}
                          onBlur={handleBlur}
                          onChange={(_event, newValue) => {
                            setFieldValue(
                              `restrictions.whitelist[${index}]`,
                              newValue ? newValue.id : ""
                            );
                          }}
                        />
                      </Grid>

                      <Grid item sm={2}>
                        <Button
                          startIcon={<CloseIcon fontSize="small" />}
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <Typography variant="body1">Remove</Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                <LightBlueTextColorButton
                  onClick={() => arrayHelpers.push("")}
                  color="primary"
                  startIcon={<AddIcon fontSize="small" />}
                >
                  Add Player
                </LightBlueTextColorButton>
              </Box>
            )}
          />
        </Box>
      </CustomAccordionDetails>
    </CustomAccordion>
  );
};
