import { styled } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";

const Root = styled("div")(({ ismobile }) => `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: rgba(255, 255, 255, 0.75);
    font-size: 40px;
    display: inline-block;
    margin: ${ismobile ? '0 5px' : '0 10px'};
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
`);

function Loading() {
  const { isMobile } = useStore(); 

  return (
    <Root ismobile={Number(isMobile)}>
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

export default observer(Loading)