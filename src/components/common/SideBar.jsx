import React, { useMemo } from "react";
import { useHistory } from "react-router";

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { mainLayoutRoutes } from "routes";

const SideBar = (props) => {
  const history = useHistory();
  const { user } = props;
  const filteredRoutes = useMemo(
    () =>
      user
        ? mainLayoutRoutes
        : mainLayoutRoutes.filter((item) => !item.guarded),
    [user]
  );

  return (
    <Box width="250px" mr={4}>
      <List>
        {filteredRoutes.map((routeItem) => (
          <ListItem
            button
            key={routeItem.id}
            onClick={() => history.push(routeItem.path)}
          >
            <ListItemIcon>{routeItem.icon}</ListItemIcon>
            <ListItemText primary={routeItem.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
