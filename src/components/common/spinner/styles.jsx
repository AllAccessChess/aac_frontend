import styled from "styled-components";

export const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: ${(props) => (props.size ? props.size + "px" : "60px")};
`;
