import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { AppBar, styled, IconButton, useMediaQuery } from "@mui/material";
import { Menu, Search, DarkMode } from '@mui/icons-material';
import { AccountCircle, FormatLineSpacing, CloudOff, LocationOff } from '@mui/icons-material';
import AutoComplete from './AutoComplete';


const Menubar = () => {

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
                  <IconButtonWrapper 
                    param={Number(rainningAreaVisible)} 
                    onClick={() => setRainningAreaVisible(!rainningAreaVisible)}
                  >
                    <FormatLineSpacing />
                  </IconButtonWrapper>
                  <IconButtonWrapper 
                    param={Number(!rainningCloudVisible)} 
                    onClick={() => setRainningCloudVisible(!rainningCloudVisible)}
                  >
                    <CloudOff />
                  </IconButtonWrapper>
                  <IconButtonWrapper 
                    param={Number(!CCTVMarkersVisible)} 
                    onClick={() => setCCTVMarkersVisible(!CCTVMarkersVisible)}
                  >
                    <LocationOff />
                  </IconButtonWrapper>
                </>
              )}
              <IconButtonWrapper 
                param={Number(!themeMode)} 
                onClick={() => setThemeMode(!themeMode)}
              >
                <DarkMode />
              </IconButtonWrapper>
            </>
          )}
          <IconButtonWrapper
            onClick={() => {
              isMenuExtended && setMobileFabsVisible(false)
              setIsMenuExtended((prev) => !prev)
              setMobileFabsVisible(!mobileFabsVisible)
              setRainningAreaVisible(false)
              setIsInputExtended(false)
            }}
          >
            <Menu />
          </IconButtonWrapper>
        </>
        :
        <>
          <IconButtonWrapper onClick={() => setIsMenuExtended((prev) => !prev)}>
            <Menu />
          </IconButtonWrapper>
          {isMenuExtended && mapTilesLoaded && (
            <>
              <IconButtonWrapper 
                param={Number(searchbarVisible)} 
                onClick={() => setSearchbarVisible(!searchbarVisible)}
              >
                <Search />
                {searchbarVisible && (
                  <div className='popup-bar' onClick={(e) => e.stopPropagation()}>
                    <AutoComplete extend={false}/>
                  </div>
                )}
              </IconButtonWrapper>
              <IconButtonWrapper 
                param={Number(rainningAreaVisible)} 
                onClick={() => setRainningAreaVisible(!rainningAreaVisible)}
              >
               <FormatLineSpacing />
              </IconButtonWrapper>
              <IconButtonWrapper 
                param={Number(!rainningCloudVisible)} 
                onClick={() => setRainningCloudVisible(!rainningCloudVisible)}
              >
                <CloudOff />
              </IconButtonWrapper>
              <IconButtonWrapper 
                param={Number(!CCTVMarkersVisible)} 
                onClick={() => setCCTVMarkersVisible(!CCTVMarkersVisible)}
              >
                <LocationOff />
              </IconButtonWrapper>
              <IconButtonWrapper 
                param={Number(!themeMode)} 
                onClick={() => setThemeMode(!themeMode)}
              >
                <DarkMode />
              </IconButtonWrapper>
              <IconButtonWrapper>
                <AccountCircle />
              </IconButtonWrapper>
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
  `
);

const IconButtonWrapper = styled(IconButton)(({ param }) => `
    color: ${param && 'rgb(30,155,255)'};
`);

export default observer(Menubar)