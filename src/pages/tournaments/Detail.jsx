import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Link as RouterLink } from "react-router-dom";
import { Link, Typography, Button } from "components/common/SpacedMui";
import { Box, Paper, Tabs, Tab } from "@material-ui/core";
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

const Detail = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );

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

      <CustomPaper square>
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
            {round.matches.map((match) => (
              <Link
                key={match.id}
                component={RouterLink}
                color="secondary"
                to={`/match/${match.id}`}
              >
                {match.white} vs {match.black}
              </Link>
            ))}
          </TabPanel>
        ))}
      </CustomPaper>
    </Box>
  );
};

export default Detail;
