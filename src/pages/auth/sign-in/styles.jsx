import styled from "styled-components";
import { makeStyles } from "@material-ui/core";

import { Grid } from "components/material-ui";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
  },
}));

export const Logo = styled.img`
  width: 113px;
`;

export const FullForm = styled.form`
  width: 100%;
`;

export const BackgroundWrapper = styled(Grid)`
  background: url(${(props) => props.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-position-x: 200px;
  background-position-y: bottom;
`;
