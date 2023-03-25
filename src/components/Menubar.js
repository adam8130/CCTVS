import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton, useMediaQuery } from "@mui/material";
import { Search, DarkMode, VideoCameraBack, AccountCircle } from '@mui/icons-material'
import AutoComplete from './AutoComplete'


const Menubar = () => {

  const { setCameraURL, setMode, isMobile, isPopup, setIsPopup  } = useStore()
  const { mode, cameraURL } = useStore()
  const isLandscape = useMediaQuery('(orientation: landscape)')

  return(
    <RootBox ismobile={Number(isMobile)} islandscape={Number(isLandscape)}>
      
      { isMobile && !isLandscape?
        <>
          <AutoComplete/>

          <IconButton sx={{color: cameraURL? 'rgb(30,155,255)' : ''}}
            onClick={() => setCameraURL(null)}
          >
            <VideoCameraBack/>
          </IconButton>

          <IconButton sx={{color: !mode? 'rgb(30,155,255)' : ''}}
            onClick={() => setMode(!mode)}
          >
            <DarkMode/>
          </IconButton>
        </>
        :
        <>
          <IconButton sx={{color: isPopup? 'rgb(30,155,255)' : ''}}
            onClick={(e) => setIsPopup(!isPopup)}
          >
            <Search/>
          </IconButton>
          
          { isPopup && <div className='popup-bar'><AutoComplete/></div> }

          <IconButton sx={{color: cameraURL? 'rgb(30,155,255)' : ''}}
            onClick={() => setCameraURL(null)}
          >
            <VideoCameraBack/>
          </IconButton>

          <IconButton sx={{color: !mode? 'rgb(30,155,255)' : ''}}
            onClick={() => setMode(!mode)}
          >
            <DarkMode/>
          </IconButton>

          <IconButton><AccountCircle/></IconButton>
        </>
      }
      
    
    </RootBox>
  )
}

const RootBox = styled(AppBar)(({ismobile, islandscape, theme}) => `
  margin: auto;
  width: ${ismobile && !islandscape ? '90vw' : '40px'};
  height: ${ismobile && !islandscape ? '50px' : '100%'};
  padding: ${ismobile && !islandscape ? '0 5px' : '40px 0'};
  display: flex;
  justify-content: space-around;
  flex-direction: ${ismobile && !islandscape ? 'row' : 'column'};
  align-items: center;
  position: absolute;
  left: 0;
  right: ${ismobile && !islandscape ? 0 : 'unset'};
  top: ${ismobile && !islandscape ? '5%' : 0};
  bottom: ${ismobile && !islandscape ? 'unset': 'unset'};
  background: ${theme.palette.menubar.main};
    .popup-bar {
      position: absolute;
      top: 15%;
      left: 130%;
    }
`)

export default observer(Menubar)