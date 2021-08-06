import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { useTheme } from "@material-ui/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@material-ui/icons";

import { Box, List } from "components/material-ui";
import { setSidebarCollapsed } from "redux/reducers/themeReducer";
import { mainLayoutRoutes } from "routes/mainLayoutRoutes";
import { isAdmin } from "utils/common";

import {
  CustomListItem,
  CustomListItemIcon,
  CustomListItemText,
  ToggleButton,
} from "./styles";

export const SideBar = (props) => {
  const { user, sidebarCollapsed } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();

  const filteredRoutes = useMemo(
    () =>
      mainLayoutRoutes.filter(
        (item) =>
          item.sidebar &&
          (user && user.id
            ? !item.adminAccess || isAdmin(user)
            : !item.redirectToSignIn)
      ),
    [user]
  );

  const toggleCollapse = () => {
    dispatch(setSidebarCollapsed(!sidebarCollapsed));
  };

  return (
    <Box
      bgcolor={theme.palette.background.paper}
      zIndex={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <List>
        {filteredRoutes.map(({ id, path, name, icon: Icon }) => (
          <CustomListItem
            key={id}
            button
            selected={location.pathname === path}
            onClick={() => history.push(path)}
            title={name}
          >
            <CustomListItemIcon>
              <Icon
                color={location.pathname === path ? "primary" : "inherit"}
              />
            </CustomListItemIcon>
            {!sidebarCollapsed && <CustomListItemText primary={name} />}
          </CustomListItem>
        ))}
      </List>
      <ToggleButton m={2} onClick={toggleCollapse}>
        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </ToggleButton>
    </Box>
  );
};
