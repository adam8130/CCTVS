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
import MobileFabs from "./components/MobileFabs.js"


const libraries = ['places']

const App = () => {
  
  const [ type, setType ] = useState(null)
  const { videoURL, themeMode, selectedCityName, setIsMobile, setServerURL } = useStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const currentTheme = createTheme(themeMode? light : dark)

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
    if (!videoURL) return

    if (videoURL.includes('thb.gov')) {
      setType('img')
    }
    else if (['Taipei', 'PingtungCounty', 'YunlinCounty'].includes(selectedCityName)) {
      setType('iframe')
    }
    else if (['YilanCounty'].includes(selectedCityName)) {
      setType('video')
    }
    else {
      setType('img')
    }
  }, [selectedCityName, videoURL])
  
  return (
    <ThemeProvider theme={currentTheme}>
      <RootBox ismobile={Number(isMobile)} islandscape={Number(isLandscape)}>
        { isLoaded && <Map/> }
        { videoURL && <MediaCam type={type}/> }
        { isLoaded && <Menubar/> }
        { isMobile && !isLandscape? <MobileFabs/> : <Fabs/> }
      </RootBox>
    </ThemeProvider>
  )
}

const RootBox = styled('div')(({ ismobile, islandscape }) => `
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`)

export default observer(App)
