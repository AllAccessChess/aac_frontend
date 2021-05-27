import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { spacing } from "@material-ui/system";

import { AppBar, Box, Link as MuiLink } from "@material-ui/core";
import Notification from "components/Notification";
import AccountMenu from "components/AccountMenu";

import logoImg from "assets/images/logo.png";
import headerImg from "assets/images/header_background.svg";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "redux/reducers/authReducer";

const Link = styled(MuiLink)(spacing);
const Wrapper = styled(AppBar)`
  background: url(${(props) => props.background});
  background-size: cover;
  padding: 20px 5%;
`;

const Logo = styled.img`
  width: 290px;
`;

const menus = [
  {
    label: "Tournaments",
    url: "/tournaments",
  },
  {
    label: "FAQ",
    url: "/faq",
  },
];

const TopBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const handleLogout = () => {
    dispatch(setUser(null));
  };

  return (
    <Wrapper position="static" background={headerImg}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Link component={RouterLink} to="/">
          <Logo src={logoImg} />
        </Link>
        <Box display="flex" justifyContent="space-around" alignItems="center">
          {menus.map((menu, index) => (
            <Link
              component={RouterLink}
              to={menu.url}
              color="inherit"
              variant="h4"
              mr={10}
              key={index}
            >
              {menu.label}
            </Link>
          ))}
          <Notification />
          <AccountMenu user={user} onLogOut={handleLogout} />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default TopBar;
