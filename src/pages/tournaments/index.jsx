import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core";

import { TournamentStatus } from "constant";
import { TabPanel } from "components/common";
import { Box, Tab, Tabs, Typography } from "components/material-ui";
import { getTournamentList } from "redux/reducers/tournamentReducer";
import TournamentCard from "./TournamentCard";

const Tournament = () => {
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(TournamentStatus.ONGOING);

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
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      borderRadius={10}
      p={5}
      m={4}
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="h3">Tournaments</Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tournaments"
      >
        <Tab label="Registered tournaments" value={TournamentStatus.ONGOING} />
        <Tab label="Upcoming tournaments" value={TournamentStatus.SCHEDULED} />
        <Tab label="Past tournaments" value={TournamentStatus.FINISHED} />
      </Tabs>
      {Object.values(TournamentStatus).map((status) => (
        <TabPanel value={tabValue} index={status} key={status}>
          {tournamentList
            .filter((tournament) => tournament.state === status)
            .map((tournament) => (
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
      ))}
    </Box>
  );
};

export default Tournament;
