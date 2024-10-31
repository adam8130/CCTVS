import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, useTheme, useMediaQuery } from "@mui/material";
import { Menu, Search, DarkMode } from '@mui/icons-material';
import { EventNote, CloudOff, LocationOff } from '@mui/icons-material';
import { ButtonWrapper } from "../utils/components/ButtonWrapper";
import AutoComplete from './AutoComplete';


const Menubar = () => {

  const theme = useTheme()
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const [isMenuExtended, setIsMenuExtended] = useState(true)
  const [isInputExtended, setIsInputExtended] = useState(false)
  const {
    isMobile, mapTilesLoaded, mobileFabsVisible,
    searchbarVisible, rainningCloudVisible,
    rainningAreaVisible, themeMode, CCTVMarkersVisible
  } = useStore()
  const {
    setMobileFabsVisible, setThemeMode, setSearchbarVisible,
    setRainningCloudVisible, setRainningAreaVisible, setCCTVMarkersVisible
  } = useStore()

  return (
    <RootBox
      mobile={Number(isMobile)}
      landscape={Number(isLandscape)}
      extended={Number(isMenuExtended)}
      tilesloaded={Number(mapTilesLoaded)}
    >
      {isMobile && !isLandscape ?
        <>
          {isMenuExtended && (
            <>
              <AutoComplete
                extend
                minwidth={'130px'}
                maxwidth={'260px'}
                extended={setIsInputExtended}
              />
              {!isInputExtended && (
                <>
                  <ButtonWrapper 
                    color={theme.palette.menubar.font}
                    activeTrigger={Number(rainningAreaVisible)}
                    onClick={() => setRainningAreaVisible(!rainningAreaVisible)}
                    icon={<EventNote />}
                  />
                  <ButtonWrapper 
                    color={theme.palette.menubar.font}
                    activeTrigger={Number(!rainningCloudVisible)}
                    onClick={() => setRainningCloudVisible(!rainningCloudVisible)}
                    icon={<CloudOff />}
                  />
                  <ButtonWrapper 
                    color={theme.palette.menubar.font}
                    activeTrigger={Number(!CCTVMarkersVisible)}
                    onClick={() => setCCTVMarkersVisible(!CCTVMarkersVisible)}
                    icon={<LocationOff />}
                  />
                </>
              )}
              <ButtonWrapper 
                color={theme.palette.menubar.font}
                activeTrigger={Number(!themeMode)}
                onClick={() => setThemeMode(!themeMode)}
                icon={<DarkMode />}
              />
            </>
          )}
          <ButtonWrapper
            color={theme.palette.menubar.font} 
            onClick={() => {
              isMenuExtended && setMobileFabsVisible(false)
              setIsMenuExtended((prev) => !prev)
              setMobileFabsVisible(!mobileFabsVisible)
              setRainningAreaVisible(false)
              setIsInputExtended(false)
            }}
            icon={<Menu />}
          />
        </>
        :
        <>
          <ButtonWrapper
            color={theme.palette.menubar.font}
            onClick={() => setIsMenuExtended((prev) => !prev)}
            icon={<Menu />}
          />
          {isMenuExtended && mapTilesLoaded && (
            <>
              <ButtonWrapper 
                activeTrigger={Number(searchbarVisible)} 
                onClick={() => setSearchbarVisible(!searchbarVisible)}
              >
                <Search />
                {searchbarVisible && (
                  <div className='popup-bar'>
                    <AutoComplete extend={false}/>
                  </div>
                )}
              </ButtonWrapper>
              <ButtonWrapper 
                color={theme.palette.menubar.font}
                activeTrigger={Number(rainningAreaVisible)}
                onClick={() => setRainningAreaVisible(!rainningAreaVisible)}
                icon={<EventNote />}
              />
              <ButtonWrapper 
                color={theme.palette.menubar.font}
                activeTrigger={Number(!rainningCloudVisible)}
                onClick={() => setRainningCloudVisible(!rainningCloudVisible)}
                icon={<CloudOff />}
              />
              <ButtonWrapper 
                color={theme.palette.menubar.font}
                activeTrigger={Number(!CCTVMarkersVisible)}
                onClick={() => setCCTVMarkersVisible(!CCTVMarkersVisible)}
                icon={<LocationOff />}
              />
              <ButtonWrapper 
                color={theme.palette.menubar.font}
                activeTrigger={Number(!themeMode)}
                icon={<DarkMode />}
                onClick={() => setThemeMode(!themeMode)}
              />
            </>
          )}
        </>
      }
    </RootBox>
  )
}

const RootBox = styled(AppBar)(
  ({ mobile, landscape, extended, theme, tilesloaded }) => `
    width: ${
      mobile && extended && !landscape ? '95vw' : '50px'
    };
    height: ${
      mobile && !landscape ? '50px' :
      mobile && extended && landscape ? '90%' :
      !mobile && !tilesloaded ? '50px' :
      extended ? '45%' : '50px'
    };
    padding: ${
      mobile && !landscape && extended ? '0 10px' :
      mobile && !landscape ? '0 5px' :
      !mobile && !tilesloaded ? '5px 0' :
      extended ? '15px 0' : '5px 0'
    };
    
    display: flex;
    justify-content: space-between;
    flex-direction: ${mobile && !landscape ? 'row' : 'column'};
    align-items: center;

    position: fixed;
    top: ${mobile && !landscape ? '2%' : '15px'};
    left: ${mobile && !landscape ? 'unset' : '30px'};
    right: ${mobile && !landscape ? '10px' : 'unset'};
    bottom: ${mobile && !landscape ? 'unset' : 'unset'};

    background: ${theme.palette.menubar.main};
    border-radius: 10px;
    transition: all 0.3s;

    .popup-bar {
      width: 100%;
      position: absolute;
      left: 135%;
    }
    > .MuiIconButton-root: nth-of-type(2) {
      position: relative;
    }
  `
);

export default observer(Menubar)