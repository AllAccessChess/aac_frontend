import React, { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "components/material-ui";
import {
  CustomAccordion,
  ByeCell,
  SmallInfoIcon,
  CustomExpandMoreIcon,
} from "./styles";
import { Spinner } from "components/common";

import { updateByes } from "redux/reducers/tournamentReducer";

export const Byes = (props) => {
  const dispatch = useDispatch();
  const { tournament, byes, byeSaving } = props;
  const [byesField, setByesField] = useState(byes);

  const remainings = useMemo(
    () =>
      Math.floor(byesField.length / 2) -
      byesField.filter((bye) => bye === true).length,
    [byesField]
  );
  const dirty = useMemo(
    () => byesField.some((value, index) => value !== byes[index]),
    [byes, byesField]
  );

  const handleClickBye = (index) => {
    let field = [...byesField];
    field[index] = !field[index];
    setByesField(field);
  };
  const handleSave = () => {
    dispatch(updateByes(tournament.id, byesField));
  };

  useEffect(() => {
    setByesField(byes);
  }, [byes]);

  if (!byes.length) return <></>;
  return (
    <CustomAccordion>
      <AccordionSummary expandIcon={<CustomExpandMoreIcon />}>
        <Typography variant="h4" px={4}>
          Manage Byes ({Math.max(remainings, 0)} remaining)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="flex-end"
          px={4}
          pb={4}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="textSecondary" mr={1}>
                Select the rounds you want a 1/2 point bye
              </Typography>
              <SmallInfoIcon />
            </Box>
            <Box display="flex" alignItems="center" mt={4}>
              {byesField.map((bye, index) => (
                <ByeCell
                  key={index}
                  variant="body1"
                  state={bye ? "active" : ""}
                  onClick={() => handleClickBye(index)}
                >
                  {index + 1}
                </ByeCell>
              ))}
            </Box>
          </Box>
          {byeSaving ? (
            <Spinner />
          ) : remainings >= 0 && dirty ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Bye
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </CustomAccordion>
  );
};
