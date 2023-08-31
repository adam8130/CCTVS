import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { dark } from "../theme/darkMap"
import Rainning from "../components/Rainning";
import Loading from "../components/Loading";
import axios from "axios";
import RainningArea from "../components/RainningArea";


const Map = (props) => {

  // 定義變量
  const [CCTVSData, setCCTVSData] = useState([]);
  const [rainningArr, setRainningArr] = useState([]);
  const [rainningAreaArr, setRainningAreaArr] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const { map, selectedCityName, selectedCCTVID, searchData, serverURL, userPosition } = useStore();
  const { themeMode, mapTilesLoaded, rainningCloudVisible, rainningAreaVisible,disabledViewportExtend } = useStore();
  const { setVideoURL, setVideoName, setMapTilesLoaded, setUserPosition } = useStore();
  const { setSelectedCCTVID, setMap, setCurrentMapZoomedLevel, setCurrentMapBounds } = useStore();

  // GoogleMap參數
  const options = useMemo(() => ({
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles: themeMode ? '' : dark
  }), [themeMode])

  // 取得用戶位置 & 設定地圖初始位置
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setUserPosition({ lat: coords.latitude, lng: coords.longitude })
    })
  }, [setUserPosition])

  // 取得天氣資料
  useEffect(() => {
    axios(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${process.env.REACT_APP_WEATHER_KEY}&elementName=Weather&parameterName=CITY`)
      .then(res => {
        let rainningArr = []
        let rainningAreaArr = []
        res.data.records.location.forEach(item => {
          if (item.weatherElement[0].elementValue.includes('雨')) {
            rainningArr.push({
              locationName: item.locationName,
              lat: item.lat,
              lon: item.lon,
              weather: item.weatherElement[0].elementValue
            })
          }
          if (
            item.weatherElement[0].elementValue.includes('雨') && 
            !rainningAreaArr.includes(item.parameter[0].parameterValue)
          ) {
            rainningAreaArr.push(item.parameter[0].parameterValue)
          }
        })
        setRainningAreaArr(rainningAreaArr);
        setRainningArr(rainningArr)
      })
  }, [])

  // 取得縣市影像
  useEffect(() => {
    if (!selectedCityName) return;
    axios(`${serverURL}/cities?cityName=${selectedCityName}`)
      .then(res => {
        if (!searchData && !disabledViewportExtend) {
          const view = new window.google.maps.LatLngBounds()
          res.data.CCTVs.forEach(item => 
            view.extend({
              lat:  Number(item.PositionLat), 
              lng:  Number(item.PositionLon)
            })
          )
          map.fitBounds(view)
        }
        setCCTVSData(res.data.CCTVs)
      })
  }, [selectedCityName, serverURL, map, searchData, disabledViewportExtend])


  // 取得CCTV資源
  const getVideoSource = (item, selectedCityName) => {
    // handle highway CCTV sources
    if (item.City) {
      setVideoURL(item.VideoStreamURL)
      setVideoName({ t1: item.RoadName, t2: item.SurveillanceDescription })
    }
    else if (['ChanghuaCounty', 'YunlinCounty'].includes(selectedCityName)) {
      setVideoURL(item.VideoStreamURL)
      setVideoName({ t1: item.RoadName, t2: item.SurveillanceDescription })
    }
    else if (selectedCityName === 'Taipei') {
      const cctvID = item.CCTVID.replace('T000', '')
      const newVideoStreamURL = `https://www.twipcam.com/cam/tpe-000${cctvID}`
      setVideoURL(newVideoStreamURL)
      setVideoName({ t1: item.RoadName, t2: item.SurveillanceDescription })
    }
    else if (selectedCityName === 'YilanCounty') {
      const did = item.did
      axios(`https://ilcpb.ivs.hinet.net/public/ajaxGetStream?did=${did}&page=ilcpb`)
      .then(res => {
        setVideoURL(res.data.data[0].camurl)
        setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
      })
    }
    else if (selectedCityName === 'Kaohsiung') {
      const newVideoStreamURL = item.VideoStreamURL.replace('snapshot', '')
      setVideoURL(newVideoStreamURL)
      setVideoName({t1: item.RoadName, t2: item.SurveillanceDescription})
    }
    else {
      setVideoURL(`${serverURL}/api?cityName=${selectedCityName}&url=${item.VideoStreamURL}`)
      setVideoName({ t1: item.RoadName, t2: item.SurveillanceDescription })
    }
    setSelectedCCTVID(item.CCTVID)
  }

  return (
    <GoogleMap
      zoom={10}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={userPosition}
      options={options}
      onZoomChanged={() => map && setCurrentMapZoomedLevel(map.zoom)}
      onLoad={(map) => setMap(map)}
      onBoundsChanged={() => setCurrentMapBounds(map.getBounds())}
      onTilesLoaded={() => setMapTilesLoaded(true)}
    >
      {!mapTilesLoaded && <Loading />}
      {CCTVSData && CCTVSData.map(item =>
        <Marker
          key={item.CCTVID}
          position={{ lat: Number(item.PositionLat), lng: Number(item.PositionLon) }}
          onClick={() => getVideoSource(item, selectedCityName)}
          icon={{
            url: 
              selectedCCTVID === item.CCTVID ?
              require('../static/markers/live-orange32.png') :
              item.City ? require('../static/markers/live-blue32.png') :
              require('../static/markers/live-green32.png')
          }}
        />
      )}
      {userPosition && (
        <Marker
          position={userPosition}
          icon={{
            url: require('../static/markers/ylw32.png') 
          }}
        />
      )}

      {props.children}

      {searchData?.map(item =>
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
            {popupInfo === item.place_id &&
              <img
                src={item?.photos[0]?.getUrl()}
                style={{ width: '200px' }}
                onClick={() => setPopupInfo(null)}
                alt=''
              />
            }
          </>
        </InfoWindow>
      )}

      {rainningAreaVisible && rainningAreaArr.length && (
        <RainningArea list={rainningAreaArr} />
      )}

      {rainningCloudVisible && 
        rainningArr?.map((item, i) => (
          <Rainning key={i} {...item} />
        )
      )}
    </GoogleMap>
  )
}


export default observer(Map)
