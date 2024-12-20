import React from 'react'
import { Fab, styled, useTheme } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'
import { getUserCurrentCity } from '../utils/functions/getUserCurrentCity'
import { NearMe } from '@mui/icons-material'


const MobileFabs = () => {

  const { map, userPosition, mobileFabsVisible, availableCities, fabsMenuVisible } = useStore()
  const { setSelectedCityName, setFabsMenuVisible, setDisabledViewportExtend } = useStore()
  const theme = useTheme()

  return (
    <RootBox>
      {!fabsMenuVisible && mobileFabsVisible &&
        <FabGroup>
          <Fab
            variant='extended'
            size='small'
            sx={{ background: theme.palette.menubar.main, color: theme.palette.menubar.font }}
            onClick={async () => {
              const result = await getUserCurrentCity(userPosition)
              if (!result) return;

              availableCities.forEach(item => {
                if (result.includes(item.cityZH)) {
                  setSelectedCityName(item.cityEN)
                  setDisabledViewportExtend(true)
                  map.setZoom(15)
                  map.panTo({ lat: Number(userPosition.lat), lng: Number(userPosition.lng) })
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
                sx={{ background: theme.palette.menubar.main, color: theme.palette.menubar.font }}
                onClick={() => {
                  setSelectedCityName(item.cityEN)
                  setFabsMenuVisible(false)
                  setDisabledViewportExtend(false)
                }}
              >
                {item.cityZH}
              </Fab>
            ))
          }
        </FabGroup>
      }
    </RootBox>
  )
}

export default observer(MobileFabs)

const RootBox = styled('div')`
  width: 90%;
  z-index: 100;
  position: fixed;
  top: 12%;
  left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FabGroup = styled('div')`
  width: 100%;
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 2px 0;
    button {
        flex-shrink: 0;
        width: 60px;
        height: 30px;
        padding: 5px;
        box-shadow: 0px 2px 2px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 2px 2px 0px rgb(0 0 0 / 12%);
    }
    &::-webkit-scrollbar{
      display: none;
    }
`