import React, { useEffect, useRef, useState } from "react";
import { styled, IconButton, useMediaQuery } from "@mui/material";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { Circle, Close, OpenInFull } from "@mui/icons-material";
import MeidaLoadingMask from "./MeidaLoadingMask";
import useDrag from '../hooks/useDrag'
import useResize from "../hooks/useResize";
import Hls from 'hls.js'
import axios from "axios";



const MediaCam = ({ type }) => {
  
  const { selectedCityName, videoURL, videoName, isMobile, serverURL, setVideoRef, setVideoURL } = useStore()
  const [ isLoading, setIsLoading ] = useState(true)
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const ref = useRef(null)
  
  useDrag('RootBox')
  useResize('Resize')

  const options = {
    ref: ref,
    ismobile: Number(isMobile),
    loading: 'lazy',
    media: type,
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.src = videoURL
      setIsLoading(true)
      setVideoRef(ref)
    }
  }, [ref, type, videoURL, setVideoRef, setIsLoading, isMobile])

  // 處理iframe
  useEffect(() => {
    if (type === 'iframe' && videoURL && ref.current) {
      if (ref.current.contentDocument || ref.current.contentWindow) {
        setIsLoading(false)
      }
    }
  } ,[type, ref, videoURL])

  // 處理.m3u8
  useEffect(() => {
    let hlsPlayer
    if (type !== 'img' && selectedCityName === 'YilanCounty') {
      hlsPlayer = new Hls()
      hlsPlayer.loadSource(videoURL)
      hlsPlayer.attachMedia(ref.current)
    }
    return () => {
      type !== 'img' && selectedCityName === 'YilanCounty' && hlsPlayer.destroy()
    }
  }, [type, videoURL, ref, selectedCityName])

  return (
    <RootBox 
      id='RootBox' 
      media={type}
      ismobile={Number(isMobile)}
      islandscape={Number(isLandscape)}
    >
      <Resize id='Resize'>
        <OpenInFull/>
      </Resize>
      <TitleBox ismobile={Number(isMobile)} isloading={Number(isLoading)}>
        <div className='top-bar'>
          <Circle/>
          <p>{ videoName.t1 ? videoName.t1 : videoName.t2 ? videoName.t2 : ' --- ' }</p>
        </div>

        <IconButton onClick={(e) => {
          setVideoURL(null)
          axios(`${serverURL}/close`)
        }}>
          <Close sx={{fontSize: isMobile ? '1.2rem' : '1.5rem'}}/>
        </IconButton>
      </TitleBox>

      <div className="CCTV-Box">
        
        { isLoading &&  <MeidaLoadingMask/> }
        
        { type === 'img' && 
          <img 
            alt=''
            onLoad={() => setIsLoading(false)} 
            {...options}
          /> 
        }

        { type === 'iframe' &&
            <iframe 
              title='iframeCam'
              style={{'pointerEvents': 'none'}}
              onLoad={() => setIsLoading(false)} 
              {...options} 
            /> 
        }

        { type === 'video' && 
          <video 
            autoPlay
            controls
            playsInline
            onLoadedData={() => setIsLoading(false)}
            {...options}
          /> 
        }
        
      </div>
    </RootBox>
  )
}

export default observer(MediaCam)


const RootBox = styled('div')(({ismobile, media, islandscape}) => `
  z-index: 90;
  position: absolute;
  width: ${ismobile? '300px' : '500px'};
  height: ${ismobile? '200px' : '350px'};
  top: ${ismobile? '25%' : '3%'};
  left: ${ismobile? '5%' : '5%'};
  ${islandscape && 'top: 5%; left: 10%'};
    .CCTV-Box {
      position: relative;
      width: 100%;
      height: 100%;
    }
    ${media} {
      width: 100%;
      height: 100%;
      background: black;
    }
`)
const TitleBox = styled('div')(({ismobile, isloading, theme}) => ` 
  width: 100%;
  height: ${ismobile ? '25px' : '40px'};
  background: ${theme.palette.menubar.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.palette.menubar.font};
  padding: 0 0 0 10px;
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
        p {
          max-width: ${ismobile ? '200px' : '300px'};
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        svg {
          font-size: ${ismobile ? '10px' : '14px'};
          margin-right: 10px;
          color: ${isloading ? 'rgb(255,0,33)' : 'rgb(0,248,65)'};
        }
    }
`)
const Resize = styled('div')`
    width: 30px;
    height: 30px;
    background: rgba(220,220,220,0.1);
    border-radius: 0.5rem;
    position: absolute;
    bottom: -11%;
    right: 0%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
        svg {
            color: rgba(220,220,220,0.6);
            transform: rotate(90deg);
        }
`