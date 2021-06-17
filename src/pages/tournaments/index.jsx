import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { TabPanel } from "components/common";
import { Box, Tab, Tabs, Typography } from "components/material-ui";
import { getTournamentList } from "redux/reducers/tournamentReducer";
import TournamentCard from "./TournamentCard";

const Tournament = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const tournamentList = useSelector((state) => state.tournamentReducer.list);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleViewTounamentDetail = (tournament) => {
    history.push(`/tournament/${tournament.id}`);
  };

  useEffect(() => {
    if (!tournamentList.length) dispatch(getTournamentList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <Typography variant="h3">Tournaments</Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tournaments"
      >
        <Tab label="Registered tournaments" />
        <Tab label="Upcoming tournaments" />
        <Tab label="Past tournaments" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {tournamentList.map((tournament) => (
          <Box
            width="100%"
            bgcolor="#15375C"
            p={5}
            mb={5}
            borderRadius={10}
            key={tournament.id}
          >
            <TournamentCard
              tournament={tournament}
              onViewDetails={handleViewTounamentDetail}
            />
          </Box>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {tournamentList.map((tournament) => (
          <Box
            width="100%"
            bgcolor="#15375C"
            p={5}
            mb={5}
            borderRadius={10}
            key={tournament.id}
          >
            <TournamentCard
              tournament={tournament}
              onViewDetails={handleViewTounamentDetail}
            />
          </Box>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {tournamentList.map((tournament) => (
          <Box
            width="100%"
            bgcolor="#15375C"
            p={5}
            mb={5}
            borderRadius={10}
            key={tournament.id}
          >
            <TournamentCard
              tournament={tournament}
              onViewDetails={handleViewTounamentDetail}
            />
          </Box>
        ))}
      </TabPanel>
    </Box>
  );
};

export default Tournament;
