import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { dark } from "../theme/darkMap"
import Rainning from "../components/Rainning";
import Loading from "../components/Loading";
import axios from "axios";
import * as qs from 'qs'



const Map = (props) => {

  // 定義變量
  const [ center, setCenter ] = useState(null)
  const [ data1, setData1 ] = useState([])
  const [ data2, setData2 ] = useState([])
  const [ tilesLoaded, setTilesLoaded ] = useState(false)
  const [ rainningArr, setRainningArr ] = useState([])
  const [ popupInfo, setPopupInfo ] = useState(null)
  const { map, apiToken, selectedCityName, themeMode, selectedCCTVID, searchData, serverURL } = useStore()
  const { setVideoURL, setVideoName, setApiToken } = useStore()
  const { setSelectedCCTVID, setMap, setCurrentMapZoomedLevel, setCurrentMapBounds } = useStore()

  // GoogleMap參數
  const options = useMemo(()=>({
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: themeMode? '' : dark 
  }),[themeMode])

  // 取得用戶位置 & 設定地圖初始位置
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCenter({ lat: coords.latitude, lng: coords.longitude })
    })
    navigator.geolocation.getCurrentPosition((e) => {
      console.log(e)
    })
  },[])

  // 取得天氣資料
  useEffect(() => {
    axios(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.REACT_APP_WEATHER_KEY}&elementName=Weather&parameterName=CITY`)
    .then(res => {
      let arr = []
      console.log(res.data)
      res.data.records.location.forEach(item => {
        if (item.weatherElement[0].elementValue.includes('雨')) {
          arr.push({
            locationName: item.locationName,
            lat: item.lat,
            lon: item.lon,
            weather: item.weatherElement[0].elementValue
          })
        }
      })
      setRainningArr(arr)
    })
  }, [])

  // useEffect取得token & 取得TDX縣市CCTV
  useEffect(() => {

    // 取得token
    !apiToken && axios({
      method: 'POST',
      url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        grant_type:"client_credentials",
        client_id: process.env.REACT_APP_TDX_KEY,
        client_secret: process.env.REACT_APP_TDX_VAL
      }),
    }).then(res => setApiToken(res.data.access_token))

    // 取得response
    if (['YilanCounty', 'HualienCounty', 'MiaoliCounty'].includes(selectedCityName)) {
      // EdgeCase
      axios(`${serverURL}/cities?cityName=${selectedCityName}`).then(res => {
        if (!searchData) {
          const view = new window.google.maps.LatLngBounds()
          res.data.forEach(item => view.extend({lat:  Number(item.PositionLat), lng:  Number(item.PositionLon)}))
          map.fitBounds(view)
        }
        setData1(res.data)
        setData2(null)
      })
    }
    else {
      // 取得縣市影像
      apiToken && selectedCityName && axios({
        url: `https://tdx.transportdata.tw/api/basic/v2/Road/Traffic/CCTV/City/${selectedCityName}?%24top=1000&%24format=JSON`,
        headers: { "authorization": `Bearer ${apiToken}` }
      }).then(res => {
        if (!searchData) {
          const view = new window.google.maps.LatLngBounds()
          res.data.CCTVs.forEach(item => view.extend({lat: Number(item.PositionLat), lng: Number(item.PositionLon)}))
          map.fitBounds(view)
        }
        setData1(res.data.CCTVs)
      })
      // 取得省道影像
      apiToken && selectedCityName && axios({
        url: `${serverURL}/cities?cityName=${selectedCityName}`,
      }).then(res => setData2(res.data))
    }

  },[apiToken, selectedCityName, map, serverURL, searchData, setApiToken])


  // 取得CCTV資源
  const getVideoSource = (item, selectedCityName) => {
    if (item.ID) {
      setVideoURL(item.VideoStreamURL)
      setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
    }
    else if (['Taipei', 'ChanghuaCounty', 'YunlinCounty'].includes(selectedCityName)) {
      setVideoURL(item.VideoStreamURL)
      setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
    }
    else if (['YilanCounty'].includes(selectedCityName)) {
      const did = item.did
      axios(`https://ilcpb.ivs.hinet.net/public/ajaxGetStream?did=${did}&page=ilcpb`)
      .then(res => {
        setVideoURL(res.data.data[0].camurl)
        setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
      })
    }
    else {
      setVideoURL(`${serverURL}/api?cityName=${selectedCityName}&url=${item.VideoStreamURL}`)
      setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
    }
    setSelectedCCTVID(item.CCTVID)
  }

  return (
    <GoogleMap 
      zoom={10}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      options={options}
      onZoomChanged={() => map && setCurrentMapZoomedLevel(map.zoom)}
      onLoad={(map) => setMap(map)}
      onBoundsChanged={() => setCurrentMapBounds(map.getBounds())}
      onTilesLoaded={() => setTilesLoaded(true)}
    >
      { !tilesLoaded && <Loading /> }
      { data1 && data1.map(item =>
        <Marker
          key={item.CCTVID}
          position={{lat: Number(item.PositionLat), lng: Number(item.PositionLon)}}
          onClick={() => getVideoSource(item, selectedCityName)}
          icon={{ 
            url: selectedCCTVID === item.CCTVID ? 
            require('../static/markers/live-orange32.png') :
            require('../static/markers/live-red32.png') 
          }}
        />
      )}

      { data2 && data2.map((item)=>
        <Marker
          key={item.CCTVID}
          position={{lat: item.PositionLat, lng: item.PositionLon}}
          onClick={() => getVideoSource(item, selectedCityName)}
          icon={{ 
            url: selectedCCTVID === item.CCTVID ? 
            require('../static/markers/live-orange32.png') :
            require('../static/markers/live-red32.png') 
          }}
        />
      )}

      { props.children }

      { searchData?.map(item =>
        <InfoWindow
          key={item.place_id}
          position={{ lat: item.geometry.location.lat(), lng: item.geometry.location.lng() }}
        >
          <>
            <div
              key={item.place_id} 
              onClick={() => setPopupInfo(item.place_id)}
            >
              {item.name}
            </div>
            { popupInfo === item.place_id && 
              <img 
                src={item?.photos[0]?.getUrl()} 
                style={{width: '200px'}}
                onClick={() => setPopupInfo(null)}
                alt=''
              /> 
            }
          </>
        </InfoWindow>  
      )}

      { rainningArr?.map((item, i) => 
        <Rainning key={i} {...item} /> 
      )}
    </GoogleMap>
  )
}


export default observer(Map)
