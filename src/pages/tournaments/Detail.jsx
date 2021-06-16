import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Link as RouterLink } from "react-router-dom";
import { Link, Button, Typography } from "components/common/SpacedMui";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { ChevronLeft as BackIcon } from "@material-ui/icons";

import TabPanel from "components/common/TabPanel";
import ScreenLoader from "components/common/ScreenLoader";
import TournamentCard from "./TournamentCard";

import {
  getTournament,
  clearCurrent as clearCurrentTournament,
} from "redux/reducers/tournamentReducer";

const CustomPaper = styled(Paper)`
  width: 100%;
`;

const CustomFormControl = styled(FormControl)`
  width: 180px;
  background: #0366d0;
`;

const Detail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );

  const user = useSelector((state) => state.authReducer.user);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    dispatch(clearCurrentTournament());
    history.push("/tournaments");
  };

  const handleRigster = () => {
    console.log("Registering Now");
  };

  useEffect(() => {
    if (params.id && !currentTournament) dispatch(getTournament(params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentTournament) return <ScreenLoader />;
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Button startIcon={<BackIcon />} onClick={handleBack}>
        Go Back
      </Button>

      <Box width="100%" my={5}>
        <TournamentCard
          tournament={currentTournament}
          onRegister={handleRigster}
        />
      </Box>

      <CustomPaper round="true">
        <Box p={3}>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Match Parings</Typography>
            <CustomFormControl variant="filled">
              <InputLabel id="demo-simple-select-label">Filter by</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={1200}
              >
                <MenuItem value={1200}>&#10094;1200</MenuItem>
                <MenuItem value={2400}>&#10094;2400</MenuItem>
                <MenuItem value={3600}>&#10094;3600</MenuItem>
              </Select>
            </CustomFormControl>
          </Box>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="secondary"
            onChange={handleTabChange}
            aria-label="tournaments"
          >
            {currentTournament.rounds.map((round) => (
              <Tab key={round.id} label={`Round ${round.id + 1}`} />
            ))}
          </Tabs>
          {currentTournament.rounds.map((round) => (
            <TabPanel key={round.id} value={tabValue} index={round.id}>
              {round.matches.map(
                (match) =>
                  user &&
                  (match.white.username === user.username ||
                    match.black.username === user.username) && (
                    <Link
                      key={match.id}
                      component={RouterLink}
                      color="secondary"
                      to={`/match/${match.id}`}
                    >
                      {match.white.name} vs {match.black.name}
                    </Link>
                  )
              )}
            </TabPanel>
          ))}
        </Box>
      </CustomPaper>
    </Box>
  );
};

export default Detail;
