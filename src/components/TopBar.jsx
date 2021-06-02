import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

import { AppBar, Box, Button } from "@material-ui/core";
import { Link } from "components/SpacedMui";
import Notification from "components/Notification";
import AccountMenu from "components/AccountMenu";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/background.svg";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "redux/reducers/authReducer";

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
];

const TopBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const handleLogout = () => {
    dispatch(setUser(null));
  };

  return (
    <Wrapper position="static" background={backgroundImg}>
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
          {user ? (
            <AccountMenu user={user} onLogOut={handleLogout} />
          ) : (
            <Button
              component={RouterLink}
              to="/auth/sign-in"
              color="secondary"
              size="large"
              variant="contained"
            >
              Login
            </Button>
          )}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default TopBar;
