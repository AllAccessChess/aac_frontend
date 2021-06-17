import React, { useState } from "react";
import styled from "styled-components";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

import { Button, Menu, MenuItem } from "components/material-ui";

const LargeButton = styled(Button)`
  &.MuiButton-textSizeLarge {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;

export const AccountMenu = (props) => {
  const { user, onLogOut } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    onLogOut();
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        {user.id && <MenuItem onClick={handleClose}>My account</MenuItem>}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  );
};
