import React from 'react'
import { styled } from '@mui/material'
import { useStore } from '../store/store'

const MaskBox = () => {

    const { isMobile } = useStore()

    return (
        <RootBox ismobile={Number(isMobile)}>Loading...</RootBox>
    )
}

export default MaskBox


const RootBox = styled('div')(({ismobile}) =>`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  font-size: 30px;
`)