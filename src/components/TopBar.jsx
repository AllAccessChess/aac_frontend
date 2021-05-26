import React from "react";
import styled from "styled-components";
import { spacing } from "@material-ui/system";

import { AppBar, Toolbar, Box, Link as MuiLink } from "@material-ui/core";
import logoImg from "assets/images/logo.png";
import headerImg from "assets/images/header_background.svg";

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
    label: "Home",
    url: "https://allaccesschess.com/",
  },
  {
    label: "Carrers",
    url: "https://allaccesschess.com/hiring/",
  },
  {
    label: "About",
    url: "https://allaccesschess.com/about/",
  },
  {
    label: "Events",
    url: "https://allaccesschess.com/events/",
  },
  {
    label: "Members",
    url: "https://allaccesschess.com/membership-account/your-profile/",
  },
];

const TopBar = () => {
  return (
    <Wrapper position="static" background={headerImg}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Logo src={logoImg} />
        <Box display="flex" justifyContent="space-around" alignItems="center">
          {menus.map((menu) => (
            <Link
              href={menu.url}
              color="inherit"
              variant="h4"
              mr={10}
              target="_blank"
            >
              {menu.label}
            </Link>
          ))}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default TopBar;
