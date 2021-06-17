import React, { useMemo } from "react";
import { useHistory } from "react-router";

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "components/material-ui";
import { mainLayoutRoutes } from "routes/mainLayoutRoutes";

export const SideBar = (props) => {
  const history = useHistory();
  const { user } = props;
  const filteredRoutes = useMemo(
    () =>
      user && user.id
        ? mainLayoutRoutes
        : mainLayoutRoutes.filter((item) => !item.redirectToSignIn),
    [user]
  );

  return (
    <Box width="250px" mr={4}>
      <List>
        {filteredRoutes.map(({ id, path, name, icon: Icon }) => (
          <ListItem button key={id} onClick={() => history.push(path)}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
