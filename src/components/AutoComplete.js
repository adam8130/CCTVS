import React, { useEffect, useRef, useState } from "react"
import { styled } from '@mui/material'
import { Search, Close } from '@mui/icons-material'
import { useStore } from "../store/store"
import { observer } from "mobx-react-lite"
import { LocationOn } from '@mui/icons-material'



const AutoComplete = () => {

  console.log('auto')
  const { cities, bounds, map, isPopup, setSearchData, setIsPopup, setCityName } = useStore()
  const [ dataArr, setDataArr ] = useState(null)
  const [ sessionToken, setSessionToken ] = useState(null)
  const [ service, setService ] = useState(null)
  const [ placesService, setPlacesService ] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!map) return
    setPlacesService(new window.google.maps.places.PlacesService(map))
    setSessionToken(new window.google.maps.places.AutocompleteSessionToken())
    setService(new window.google.maps.places.AutocompleteService())
  }, [map])

  const getPrediction = (value) => {
      if (value) {
        let queryOption = {
            input: value,
            bounds: bounds,
            sessionToken 
        }
        service.getQueryPredictions(queryOption, (prediction) => {
            console.log(prediction)
            prediction && setDataArr(prediction)
        })
    } else {
        setDataArr(null)
    }
  }
  
  const getResponse = (item) => {
    console.log(item)
    let request = { 
        query: item?.description || inputRef.current.value,
        language: 'zh-TW',
        openNow: false,
    }
    placesService.textSearch(request, (results) => {

        const viewport = new window.google.maps.LatLngBounds()
        const formattedCity = cities.find((item) => results[0].formatted_address.includes(item.name))

        results?.forEach( place => {
          if (place.geometry.viewport) {
            viewport.union(place.geometry.viewport)
          } else {
            viewport.extend(place.geometry.location)
          }
          item.opening_hours = null
          delete item.permanently_closed
        })

        setCityName(formattedCity && formattedCity.city)
        setDataArr(null)
        setSearchData(results)
        setIsPopup(!isPopup)
        map.fitBounds(viewport)
    })
  }

  return (
    <RootBox>
        <Search/>
        { inputRef.current?.value && 
            <Close onClick={() => {
                setDataArr(null)
                setSearchData(null)
                inputRef.current.value = ''
            }}/>
        }

        <input 
            ref={inputRef}
            onChange={(e) => getPrediction(e.target.value)}
            onFocus={(e) => getPrediction(e.target.value)}
        />

        { dataArr &&
            <PredictionBox>
                { dataArr.map((item, i) => 
                    <div className='text-box' key={i} 
                        onClick={() => {
                            getResponse(item)
                            inputRef.current.value = item.structured_formatting.main_text
                        }}
                    >
                        { item.types ? <LocationOn/> : <Search/> }
                        <div>
                            <p className='title'>{item.structured_formatting.main_text}</p>
                            <p className='address'>{item.structured_formatting.secondary_text}</p>
                        </div>
                    </div>
                )}
            </PredictionBox>
        }
    </RootBox>
  )
}

export default observer(AutoComplete)

const RootBox = styled('div')(({theme}) => `
    width: 220px;
    position: relative;
    input {
        width: 220px;
        height: 30px;
        border-radius: 5px;
        padding: 5px 30px 5px 30px;
        border: none;
        font-size: 20px;
        background: ${theme.palette.inputbar.input};
        color: ${theme.palette.inputbar.font};
    }
    svg {
        position: absolute;
        top: 20%;
        left: 3%;
        color: gray;
        font-size: 20px;
    }
    svg:nth-of-type(2) {
        left: unset;
        right: 3%;
    }
`)

const PredictionBox = styled('div')(({theme}) => `
    width: 200px;
    padding: 10px;
    background: ${theme.palette.inputbar.input};
    color: ${theme.palette.inputbar.font};
    border-radius: 0 0 5px 5px;
    position: absolute;
    top: 99%;
    cursor: pointer;
        .text-box {
            width: 100%;
            display: flex;
            align-items: center;
            height: 40px;
            margin: 5px 0;
            gap: 10px;
            svg {
                position: unset;
            }
            .title {
                font-size: 16px;
                color: ${theme.palette.inputbar.font};
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0;
                margin: 0;
            }
            div {
                width: 85%;
                .address {
                    font-size: 14px;
                    color: gray;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 0;
                    margin: 0;
                }
            }
        }
`)