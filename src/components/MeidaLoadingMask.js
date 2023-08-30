import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material'
import { useStore } from '../store/store';

const Root = styled("div")(({ mobile }) => (`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: white;
    font-size: ${mobile ? '26px' : '30px'};
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
  h6 {
    width: 70%;
    color: white;
    font-size: ${mobile ? '14px' : '18px'};
    text-align: center;
    position: absolute;
    bottom: ${mobile ? '1%' : '5%'};
  }
`));

export default function MeidaLoadingMask() {
  const [infoMsgVisible, setInfoMsgVisible] = useState(false)
  const { isMobile } = useStore()
  
  useEffect(() => {  
    const timer = setTimeout(() => {
      setInfoMsgVisible(true)

    }, 5000)

    return () => clearTimeout(timer)
  }, [isMobile])

  return (
    <Root mobile={Number(isMobile)}>
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
      {infoMsgVisible && (
        <h6>影像由各縣市政府維護, 如果一直沒有加載完成, 請換一個影像來源</h6>
      )}
    </Root>
  );
}