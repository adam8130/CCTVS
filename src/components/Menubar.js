import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton, useMediaQuery } from "@mui/material";
import { Menu, Search, DarkMode, VideoCameraBack, AccountCircle, VisibilityOff } from '@mui/icons-material'
import AutoComplete from './AutoComplete'


const Menubar = () => {

  const isLandscape = useMediaQuery('(orientation: landscape)')
  const { isMobile, mobileFabsVisible, searchbarVisible, themeMode, videoURL } = useStore()
  const { setMobileFabsVisible, setThemeMode, setSearchbarVisible, setVideoURL } = useStore()
  const [isMenuExtended, setIsMenuExtended] = useState(true)

  return (
    <RootBox
      mobile={Number(isMobile)}
      landscape={Number(isLandscape)}
      extended={Number(isMenuExtended)}
    >
      {isMobile && !isLandscape ?
        <>
          {isMenuExtended && (
            <>
              <AutoComplete />
              <IconButton 
                sx={{ color: videoURL && 'rgb(30,155,255)' }} 
                onClick={() => setMobileFabsVisible(!mobileFabsVisible)}
              >
                <VisibilityOff />
              </IconButton>
              <IconButton 
                sx={{ color: !themeMode && 'rgb(30,155,255)' }} 
                onClick={() => setThemeMode(!themeMode)}
              >
                <DarkMode />
              </IconButton>
            </>
          )}
          <IconButton 
            onClick={() => {
              isMenuExtended && setMobileFabsVisible(false)
              setIsMenuExtended((prev) => !prev)
            }}
          >
            <Menu />
          </IconButton>
        </>
        :
        <>
          <IconButton onClick={() => setIsMenuExtended((prev) => !prev)}>
            <Menu />
          </IconButton>
          {isMenuExtended && (
            <>
              <IconButton 
                sx={{color: searchbarVisible && 'rgb(30,155,255)'}} 
                onClick={() => setSearchbarVisible(!searchbarVisible)}
              >
                <Search/>
                {searchbarVisible && (
                  <div className='popup-bar' onClick={(e) => e.stopPropagation()}>
                    <AutoComplete />
                  </div>
                )}
              </IconButton>
              <IconButton sx={{color: videoURL && 'rgb(30,155,255)'}} onClick={() => setVideoURL(null)}>
                <VideoCameraBack/>
              </IconButton>
              <IconButton sx={{color: !themeMode && 'rgb(30,155,255)'}} onClick={() => setThemeMode(!themeMode)}>
                <DarkMode/>
              </IconButton>
              <IconButton>
                <AccountCircle/>
              </IconButton>
            </>
          )}
        </>
      }
    </RootBox>
  )
}

const RootBox = styled(AppBar)(({ mobile, landscape, extended, theme }) => `
  width: ${
    mobile && extended && !landscape ? '95vw' : '50px'
  };
  height: ${
    mobile && !landscape ? '50px' :
    mobile && extended && landscape ? '85%' : 
    extended ? '45%' : '50px'
  };
  padding: ${
    mobile && !landscape ? '0 5px' : 
    extended ? '15px 0' : '5px 0'
  };
  display: flex;
  justify-content: space-between;
  flex-direction: ${mobile && !landscape ? 'row' : 'column'};
  align-items: center;
  position: fixed;
  top: ${mobile && !landscape ? '3%' : '10px'};
  left: ${mobile && !landscape ? 'unset' : '10px'};
  right: ${mobile && !landscape ? '10px' : 'unset'};
  bottom: ${mobile && !landscape ? 'unset' : 'unset'};
  background: ${theme.palette.menubar.main};
  border-radius: 10px;
  transition: all 0.3s;
  .popup-bar {
    width: 100%;
    position: absolute;
    left: 130%;
  }
  > .MuiIconButton-root: nth-of-type(2) {
    position: relative;
  }
`)

export default observer(Menubar)