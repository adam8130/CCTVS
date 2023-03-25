import React from 'react'
import { Fab, styled, useTheme, useMediaQuery } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'


const Fabs = () => {

  const { cities, menu, isMobile, setCityName, setMenu, setSearchData } = useStore()
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const theme = useTheme()
  
  return (
    <RootBox>
      <MenuBox 
        onClick={() => setMenu(!menu)}
        menu={Number(menu)}
      >
        DropMenu
      </MenuBox>

      { menu && <FabGroup ismobile={Number(isMobile)} islandscape={Number(isLandscape)}>
        { 
          cities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              size='small'
              sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
              onClick={() => {
                setCityName(item.city)
                setSearchData(null)
                setMenu(false)
              }}
            >
              { item.name }
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
  top: 5%;
  right: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MenuBox = styled('div')(({menu, theme}) => `
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
  color: ${menu? 'rgb(30,155,255)' : theme.palette.menubar.font};
`)

const FabGroup = styled('div')(({ismobile, islandscape}) => `
  width: 200px;
  height: ${islandscape && ismobile ? '300px' : '400px'};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
    svg {
      margin-right: 10px;
      transform: rotate(30deg);
    }
`)