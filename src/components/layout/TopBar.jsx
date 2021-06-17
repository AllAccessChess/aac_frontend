import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { AccountMenu, Spinner } from "components/common";
import { AppBar, Box, Button, Link } from "components/material-ui";
import { logOut } from "redux/reducers/authReducer";

import logoImg from "assets/images/logo.png";
import backgroundImg from "assets/images/background.svg";

const Wrapper = styled(AppBar)`
  background: url(${(props) => props.background});
  background-size: cover;
  padding: 20px 5%;
`;

const Logo = styled.img`
  width: 113px;
`;

const menus = [
  {
    label: "Tournaments",
    url: "/tournaments",
  },
];

export const TopBar = () => {
  const dispatch = useDispatch();
  const authLoading = useSelector((state) => state.authReducer.loading);
  const user = useSelector((state) => state.authReducer.user);

  const handleLogout = () => {
    dispatch(logOut());
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
              variant="h5"
              mr={10}
              key={index}
            >
              {menu.label}
            </Link>
          ))}
          {user ? (
            <AccountMenu user={user} onLogOut={handleLogout} />
          ) : (
            <>
              {authLoading ? (
                <Spinner />
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
            </>
          )}
        </Box>
      </Box>
    </Wrapper>
  );
};
