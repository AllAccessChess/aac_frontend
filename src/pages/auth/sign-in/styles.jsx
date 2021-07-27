import styled from "styled-components";
import { Grid } from "components/material-ui";
import { GoogleLogin } from "react-google-login";

export const Logo = styled.img`
  width: 113px;
`;

export const BackgroundWrapper = styled(Grid)`
  background: url(${(props) => props.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const StyledGoogleLogin = styled(GoogleLogin)`
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  position: relative;
  background-color: #e0e0e0 !important;

  & > span {
    font-size: 1.0625rem !important;
    font-weight: 700 !important;
    font-family: Rubik, sans-serif, Inter, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  & > div {
    position: absolute;
    left: 10px;
    background-color: transparent !important;
  }
`;
