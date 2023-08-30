import { styled } from "@mui/material";

const Root = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(230, 230, 230);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: black;
    font-size: 40px;
    display: inline-block;
    margin: 0 5px;
    animation: bounce 0.6s infinite alternate;
    &:nth-of-type(1) {
      animation-delay: 0.1s;
    }
    &:nth-of-type(2) {
      animation-delay: 0.2s;
    }
    &:nth-of-type(3) {
      animation-delay: 0.3s;
    }
    &:nth-of-type(4) {
      animation-delay: 0.4s;
    }
    &:nth-of-type(5) {
      animation-delay: 0.5s;
    }
    &:nth-of-type(6) {
      animation-delay: 0.6s;
    }
    &:nth-of-type(7) {
      animation-delay: 0.7s;
    }
    &:nth-of-type(8) {
      animation-delay: 0.8s;
    }
    &:nth-of-type(9) {
      animation-delay: 0.9s;
    }
    &:nth-of-type(10) {
      animation-delay: 1s;
    }
  }

  @keyframes bounce {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-10px);
    }
  }
`;

export default function Loading() {
  return (
    <Root>
      <span>L</span>
      <span>o</span>
      <span>a</span>
      <span>d</span>
      <span>i</span>
      <span>n</span>
      <span>g</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </Root>
  );
}