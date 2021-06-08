import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { Link as RouterLink } from "react-router-dom";
import { Link } from "components/common/SpacedMui";
import { Box, Paper, Tabs, Tab } from "@material-ui/core";
import TabPanel from "components/common/TabPanel";
import ScreenLoader from "components/common/ScreenLoader";

import { getTournament } from "redux/reducers/tournamentReducer";

const CustomPaper = styled(Paper)`
  width: 100%;
`;

const Detail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const currentTournament = useSelector(
    (state) => state.tournamentReducer.current
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (params.id && !currentTournament) dispatch(getTournament(params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentTournament) return <ScreenLoader />;
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <h2>Tournament Detail Page</h2>
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
