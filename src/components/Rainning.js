import React, { memo } from 'react'
import { InfoBox } from '@react-google-maps/api'
import { styled } from '@mui/material'


const Rainning = (props) => {

    const { lat, lon, locationName, weather } = props.item
    const zoomed = props.zoomed
    
    const option = { 
        closeBoxURL: '', 
        disableAutoPan: true,
        boxStyle: { overflow: 'unset' }
    }

    console.log(weather)

    return (
        <InfoBox 
            position={{lat: lat, lng: lon}}
            options={option}
        >
            <RootBox zoomed={zoomed}>       
                <p>{locationName}</p> 
                { zoomed > 14 &&
                    <div className='rain'>
                        <span style={{'--i':10}}></span>
                        <span style={{'--i':12}}></span>
                        <span style={{'--i':16}}></span>
                        <span style={{'--i':19}}></span>
                        <span style={{'--i':10}}></span>
                        <span style={{'--i':17}}></span>
                        <span style={{'--i':11}}></span>
                        <span style={{'--i':20}}></span>
                        <span style={{'--i':10}}></span>
                        <span style={{'--i':13}}></span>
                    </div>
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
    transform: ${zoomed > 13 && 'scale(2)'};
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
        div {
            position: relative;
            display: flex;
            span {
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background: gray;
                margin: 0 1px;
                position: relative;
                bottom: -10px;
                animation: rain 5s linear infinite;
                animation-duration: calc(15s / var(--i))};
            }
            p {
                position: absolute;
                top: -10px;
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

export default memo(Rainning)