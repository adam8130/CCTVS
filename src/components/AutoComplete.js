import React, { useEffect, useRef, useState } from "react"
import { styled } from '@mui/material'
import { Search, Close } from '@mui/icons-material'
import { useStore } from "../store/store"
import { observer } from "mobx-react-lite"
import { LocationOn } from '@mui/icons-material'
import { useCancelShadow } from "../hooks/useCancelShadow"


function debounce(cb, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    setTimeout(() => cb.apply(this, args), delay)
  }
}

const AutoComplete = ({ extend, maxwidth, minwidth, extended }) => {

  const { availableCities, currentMapBounds, map, isMobile } = useStore()
  const { setSearchData, setSearchbarVisible, setSelectedCityName, setDisabledViewportExtend } = useStore()
  const [dataArr, setDataArr] = useState(null)
  const [sessionToken, setSessionToken] = useState(null)
  const [service, setService] = useState(null)
  const [placesService, setPlacesService] = useState(null)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef(null)
  const { trigger } = useCancelShadow({
    background: 'transparent',
    zIndex: 99,
    event: () => {
      inputRef.current.blur()
      setInputFocused(false)
      setDataArr(null)
      extended(false)
    }
  })

  useEffect(() => {
    if (!map) return
    setPlacesService(new window.google.maps.places.PlacesService(map))
    setSessionToken(new window.google.maps.places.AutocompleteSessionToken())
    setService(new window.google.maps.places.AutocompleteService())
  }, [map])

  const debouncedGetPrediction = debounce((value) => {
    if (value) {
      let queryOption = {
        input: value,
        bounds: currentMapBounds,
        sessionToken
      }
      service.getQueryPredictions(queryOption, (prediction) => {
        prediction && setDataArr(prediction)
      })
    } else {
      setDataArr(null)
    }
  }, 500)

  const getResponse = (item) => {
    let request = {
      query: item?.description || inputRef.current.value,
      language: 'zh-TW',
      openNow: false,
    }
    placesService.textSearch(request, (results) => {

      const viewport = new window.google.maps.LatLngBounds()
      const formattedCity = availableCities.find((item) => results[0].formatted_address.includes(item.cityZH))

      results?.forEach(place => {
        if (place.geometry.viewport) {
          viewport.union(place.geometry.viewport)
        } else {
          viewport.extend(place.geometry.location)
        }
        item.opening_hours = null
        delete item.permanently_closed
      })

      setSelectedCityName(formattedCity && formattedCity.cityEN)
      
      setDisabledViewportExtend(false)
      setDataArr(null)
      setSearchData(results)
      map.fitBounds(viewport)
      map.setZoom(13)
    })
  }

  return (
    <RootBox
      extend={Number(extend)}
      minwidth={minwidth}
      maxwidth={maxwidth}
      focused={Number(inputFocused)}
      onClick={(e) => {
        e.stopPropagation()
        isMobile && extended(true)
        inputRef.current.focus()
        setInputFocused(true)
        trigger()
      }}
    >
      <Search />
      {inputRef.current?.value &&
        <Close 
          onClick={(e) => {
            e.stopPropagation()
            setDataArr(null)
            setSearchData(null)
            setInputFocused(false)
            setSelectedCityName(null)
            setSearchbarVisible(false)
            isMobile && extended(false)
            inputRef.current.value = ''
          }} 
        />
      }

      <input
        ref={inputRef}
        onChange={(e) => debouncedGetPrediction(e.target.value)}
        onFocus={(e) => e.stopPropagation()}
      />

      {dataArr &&
        <PredictionBox 
          extend={Number(extend)}
          focused={Number(inputFocused)}
          minwidth={minwidth}
          maxwidth={maxwidth}
        >
          {dataArr.map((item, i) =>
            <div className='text-box' key={i}
              onClick={() => {
                getResponse(item)
                inputRef.current.value = item.structured_formatting.main_text
              }}
            >
              {item.types ? <LocationOn /> : <Search />}
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

const RootBox = styled('div')(({ theme, maxwidth, minwidth, focused, extend }) => `
    width: ${
      !extend ? '220px' : focused ? maxwidth : minwidth
    };
    position: relative;
    transition: all 0.3s;
    z-index: 100;
    input {
      font-size: 16px;
      width: ${
        !extend ? '220px' : focused ? maxwidth : minwidth
      };
      height: 30px;
      border-radius: 5px;
      padding: 5px 30px 5px 30px;
      border: none;
      background: ${theme.palette.inputbar.input};
      color: ${theme.palette.inputbar.font};
      outline: none;
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

const PredictionBox = styled('div')(({ theme, extend, focused, maxwidth, minwidth }) => `
    width: ${
      !extend ? '220px' : focused ? maxwidth : minwidth
    };
    padding: 10px;
    background: ${theme.palette.inputbar.input};
    color: ${theme.palette.inputbar.font};
    border-radius: 0 0 5px 5px;
    position: absolute;
    top: 99%;
    z-index: 100;
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