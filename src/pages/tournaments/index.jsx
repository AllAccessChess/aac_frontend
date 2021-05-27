import React from "react";
import styled from "styled-components";

import { Paper as MuiPaper, Tabs, Tab, Box } from "@material-ui/core";

const Paper = styled(MuiPaper)`
  width: 100%;
`;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tournament-tabpanel-${index}`}
      aria-labelledby={`tournament-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const Tournament = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="secondary"
        onChange={handleChange}
        aria-label="tournaments"
      >
        <Tab label="Registered tournaments" />
        <Tab label="Upcoming tournaments" />
        <Tab label="Past tournaments" />
      </Tabs>
      <TabPanel value={value} index={0}>
        Registered Tournaments
      </TabPanel>
      <TabPanel value={value} index={1}>
        Upcoming tournaments
      </TabPanel>
      <TabPanel value={value} index={2}>
        Past tournaments
      </TabPanel>
    </Paper>
  );
};

export default Tournament;
