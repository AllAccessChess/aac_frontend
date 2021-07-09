import React, { useState } from "react";
import { useHistory } from "react-router";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

import { Menu, MenuItem } from "components/material-ui";
import { LargeButton } from "./styles";

export const AccountMenu = (props) => {
  const history = useHistory();
  const { user, onLogOut } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    handleClose();
    history.push("/account");
  };

  const handleLogout = () => {
    handleClose();
    onLogOut();
  };

  if (!user) return null;
  return (
    <React.Fragment>
      <LargeButton
        aria-controls="account-menu"
        aria-haspopup="true"
        endIcon={<ArrowDropDownIcon />}
        size="large"
        onClick={handleClick}
      >
        {user.name && user.name.length ? user.name : user.username}
      </LargeButton>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="account-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user.id && <MenuItem onClick={handleMyAccount}>My account</MenuItem>}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  );
};
