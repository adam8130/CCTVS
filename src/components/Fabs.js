import React from 'react'
import { Fab, styled, useTheme, useMediaQuery } from '@mui/material'
import { NearMe } from '@mui/icons-material'
import { getUserCurrentCity } from '../utils/functions/getUserCurrentCity'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'


const Fabs = () => {

  const { availableCities, fabsMenuVisible, isMobile, userPosition, map } = useStore()
  const { setSelectedCityName, setFabsMenuVisible, setSearchData, setDisabledViewportExtend } = useStore()
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const theme = useTheme()

  return (
    <RootBox>
      <MenuBox 
        onClick={() => setFabsMenuVisible(!fabsMenuVisible)}
        menu={Number(fabsMenuVisible)}
      >
        DropMenu
      </MenuBox>

      { fabsMenuVisible && 
      <FabGroup 
        ismobile={Number(isMobile)}
        islandscape={Number(isLandscape)}
      >
        <Fab
          variant='extended' 
          size='small'
          sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
          onClick={async() => {
            const result = await getUserCurrentCity(userPosition)
            if (!result) return;

            availableCities.forEach(item => {
              if (result.includes(item.cityZH)) {
                setSelectedCityName(item.cityEN)
                setDisabledViewportExtend(true)
                map.setZoom(15)
                map.panTo({lat: Number(userPosition.lat), lng: Number(userPosition.lng)})
              } 
            })
          }}
        >
          <NearMe />
        </Fab>
        { 
          availableCities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              size='small'
              sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
              onClick={() => {
                setSelectedCityName(item.cityEN)
                setSearchData(null)
                setFabsMenuVisible(false)
                setDisabledViewportExtend(false)
              }}
            >
              { item.cityZH }
            </Fab>
          ))
        }
      </FabGroup>
      }
    </RootBox>
  )
}

export default observer(Fabs)

const RootBox = styled('div')`
  z-index: 100;
  position: fixed;
  top: 15px;
  right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MenuBox = styled('div')(({fabsMenuVisible, theme}) => `
  width: 200px;
  height: 35px;
  border-radius: 25px;
  background: rgba(220,220,220);
  margin-bottom: 20px;
  text-align: center;
  line-height: 35px;
  letter-spacing: 2px;
  cursor: pointer;
  font-weight: 700;
  background: ${theme.palette.menubar.main};
  color: ${fabsMenuVisible? 'rgb(30,155,255)' : theme.palette.menubar.font};
`)

const FabGroup = styled('div')(({ismobile, islandscape}) => `
  width: 200px;
  height: ${islandscape && ismobile ? '300px' : '300px'};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
`)