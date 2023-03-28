import React, { useEffect, useState } from "react"
import { createTheme, ThemeProvider, useTheme, useMediaQuery, styled } from "@mui/material"
import { dark, light } from "./theme/theme.js"
import { useLoadScript } from '@react-google-maps/api'
import { observer } from "mobx-react-lite"
import Map from './views/Map.js'
import Menubar from "./components/Menubar.js"
import Fabs from "./components/Fabs.js"
import { useStore } from "./store/store.js"
import MediaCam from "./components/MediaCam.js"
import MobFabs from "./components/MobFabs.js"


const libraries = ['places']

const App = () => {
  
  const [ type, setType ] = useState(null)
  const { cameraURL, mode, cityName, setIsMobile, setServerURL } = useStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const themeMode = createTheme(mode? light : dark)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries: libraries
  })

  useEffect(() => {
    setServerURL(process.env.REACT_APP_VM_URL)
  }, [setServerURL])

  useEffect(() => {
    setIsMobile(isMobile)
  }, [isMobile, setIsMobile])

  useEffect(() => {
    if (!cameraURL) return

    if (cameraURL.includes('thb.gov')) {
      setType('img')
    }
    else if (['Taipei', 'PingtungCounty', 'YunlinCounty'].includes(cityName)) {
      setType('iframe')
    }
    else if (['YilanCounty'].includes(cityName)) {
      setType('video')
    }
    else {
      setType('img')
    }
  }, [cityName, cameraURL])

  console.log(cameraURL)
  console.log(cityName)
  
  return (
    <ThemeProvider theme={themeMode}>
      <RootBox ismobile={Number(isMobile)} islandscape={Number(isLandscape)}>
        { isLoaded && <Map/> }
        { cameraURL && <MediaCam type={type}/> }
        { isLoaded && <Menubar/> }
        { isMobile && !isLandscape? <MobFabs/> : <Fabs/> }
      </RootBox>
    </ThemeProvider>
  )
}

const RootBox = styled('div')(({ ismobile, islandscape }) => `
  position: relative;
  width: 100vw;
  height: ${ismobile? (islandscape? '80vh': '89vh') : '100vh'};
`)

export default observer(App)
