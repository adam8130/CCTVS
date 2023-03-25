import React from 'react'
import { Fab, styled, useTheme } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'


const Fabs = () => {

  const { cities, menu, setCityName, setMenu } = useStore()
  const theme = useTheme()

  return (
    <RootBox>
      { !menu && <FabGroup>
        { 
          cities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
              onClick={() => {
                setCityName(item.city)
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
  width: 90%;
  z-index: 100;
  position: fixed;
  top: 15%;
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