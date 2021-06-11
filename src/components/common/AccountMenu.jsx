import React from "react";
import styled from "styled-components";

import { Button, Menu, MenuItem } from "@material-ui/core";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

const LargeButton = styled(Button)`
  &.MuiButton-textSizeLarge {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;

const AccountMenu = ({ user, onLogOut }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  if (!user) return <></>;
  return (
    <>
      <LargeButton
        aria-controls="account-menu"
        aria-haspopup="true"
        endIcon={<ArrowDropDownIcon />}
        size="large"
        onClick={handleClick}
      >
        {user.name}
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
    </>
  );
};

export default AccountMenu;
