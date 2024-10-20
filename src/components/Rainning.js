import React from 'react'
import { InfoBox } from '@react-google-maps/api'
import { styled } from '@mui/material'
import { useStore } from '../store/store'
import { observer } from 'mobx-react-lite'
import { isInsideBoundary } from '../utils/functions/isInsideBoundary'

const Rainning = ({ lat, lon, locationName }) => {

  const { currentMapZoomedLevel, currentMapBounds } = useStore()

  const option = {
    closeBoxURL: '',
    disableAutoPan: true,
    boxStyle: { overflow: 'unset' }
  }

  return (
    <InfoBox
      position={{ lat: lat, lng: lon }}
      options={option}
    >
      <RootBox zoomed={currentMapZoomedLevel}>
        <p>{locationName}</p>
        {
          currentMapZoomedLevel > 12 &&
          isInsideBoundary(lat, lon, currentMapBounds) &&
          (
            <div className='rain'>
              <span style={{ '--i': 10 }}></span>
              <span style={{ '--i': 12 }}></span>
              <span style={{ '--i': 16 }}></span>
              <span style={{ '--i': 19 }}></span>
              <span style={{ '--i': 10 }}></span>
              <span style={{ '--i': 17 }}></span>
              <span style={{ '--i': 11 }}></span>
              <span style={{ '--i': 20 }}></span>
              <span style={{ '--i': 10 }}></span>
              <span style={{ '--i': 13 }}></span>
            </div>
          )
        }
      </RootBox>
    </InfoBox>
  )
}

const RootBox = styled('div')(({ zoomed }) => `
    width:  50px;
    height: 22px;
    background: gray;
    position: relative;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    opacity: 0.8;
    transform: ${zoomed > 12 && 'scale(2.2)'};
    transition: all 0.3s;
        &::before {
            content: '';
            position: absolute;
            width: 15px;
            height: 15px;
            background: gray;
            border-radius: 50%;
            top: -6px;
            left: 10px;
            box-shadow: 12px -2px 0 3px gray;
        }
        .rain {
            position: relative;
            display: flex;
            span {
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background: gray;
              margin: 0 1px;
              position: relative;
              bottom: -15px;
              animation: rain 5s linear infinite;
              animation-duration: calc(15s / var(--i))};
            }
            p {
              position: absolute;
              color: rgba(220,220,220,0.9);
            }
        }
        @keyframes rain {
            0% {
                transform: translateY(0);
            }
            70% {
                transform: translateY(30px);
            }            
            100% {
                transform: translateY(30px);
            }
        }
`)

export default observer(Rainning)