import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router";

import { Box, List, ListItemIcon, ListItemText } from "components/material-ui";
import { CustomListItem } from "./styles";
import { mainLayoutRoutes } from "routes/mainLayoutRoutes";
import { isAdmin } from "utils/common";

export const SideBar = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { user } = props;
  const filteredRoutes = useMemo(
    () =>
      user && user.id
        ? mainLayoutRoutes.filter((item) => !item.adminAccess || isAdmin(user))
        : mainLayoutRoutes.filter((item) => !item.redirectToSignIn),
    [user]
  );

  return (
    <Box width="250px" mr={4}>
      <List>
        {filteredRoutes.map(({ id, path, name, icon: Icon }) => (
          <CustomListItem
            key={id}
            button
            selected={location.pathname === path}
            onClick={() => history.push(path)}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </CustomListItem>
        ))}
      </List>
    </Box>
  );
};
