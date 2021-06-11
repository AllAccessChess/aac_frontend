import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { Link as RouterLink } from "react-router-dom";
import { Link } from "components/common/SpacedMui";
import TabPanel from "components/common/TabPanel";
import { Paper as MuiPaper, Tabs, Tab } from "@material-ui/core";

import { getTournamentList } from "redux/reducers/tournamentReducer";

const Paper = styled(MuiPaper)`
  width: 100%;
`;

const Tournament = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const tournamentList = useSelector((state) => state.tournamentReducer.list);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!tournamentList.length) dispatch(getTournamentList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper square>
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        textColor="secondary"
        onChange={handleTabChange}
        aria-label="tournaments"
      >
        <Tab label="Registered tournaments" />
        <Tab label="Upcoming tournaments" />
        <Tab label="Past tournaments" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {tournamentList.map((tournament) => (
          <Link
            key={tournament.id}
            component={RouterLink}
            to={`/tournament/${tournament.id}`}
            color="secondary"
          >
            {tournament.name}
          </Link>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {tournamentList.map((tournament) => (
          <Link
            key={tournament.id}
            component={RouterLink}
            color="secondary"
            to={`/tournament/${tournament.id}`}
          >
            {tournament.name}
          </Link>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {tournamentList.map((tournament) => (
          <Link
            key={tournament.id}
            component={RouterLink}
            color="secondary"
            to={`/tournament/${tournament.id}`}
          >
            {tournament.name}
          </Link>
        ))}
      </TabPanel>
    </Paper>
  );
};

export default Tournament;
