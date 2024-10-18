import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  availableCities = [
    { cityZH: '台北', cityEN: 'Taipei' },
    { cityZH: '新北', cityEN: 'NewTaipei' },
    { cityZH: '基隆', cityEN: 'Keelung' },
    { cityZH: '桃園', cityEN: 'Taoyuan' },
    { cityZH: '苗栗', cityEN: 'MiaoliCounty' },
    { cityZH: '竹北', cityEN: 'HsinchuCounty' },
    { cityZH: '新竹', cityEN: 'Hsinchu' },
    { cityZH: '台中', cityEN: 'Taichung' },
    { cityZH: '南投', cityEN: 'NantouCounty' },
    { cityZH: '彰化', cityEN: 'ChanghuaCounty' },
    { cityZH: '雲林', cityEN: 'YunlinCounty' },
    { cityZH: '嘉義', cityEN: 'Chiayi' },
    { cityZH: '宜蘭', cityEN: 'YilanCounty' },
    { cityZH: '花蓮', cityEN: 'HualienCounty' },
    { cityZH: '台南', cityEN: 'Tainan' },
    { cityZH: '高雄', cityEN: 'Kaohsiung' },
    { cityZH: '台東', cityEN: 'TaitungCounty' },
    { cityZH: '屏東', cityEN: 'PingtungCounty' },
  ]
  
  // Api & Data
  apiToken = null
  serverURL = null
  searchData = null
  selectedCCTVID = null
  selectedCityName = null

  setApiToken = act => this.apiToken = act
  setServerURL = act => this.serverURL = act
  setSearchData = act => this.searchData = act
  setSelectedCCTVID = act => this.selectedCCTVID = act
  setSelectedCityName = act => {
    this.videoRef && ( this.videoRef.current.src = null )
    this.selectedCityName = act
    this.videoURL = null
    this.selectedCCTVID = null
  }
  
  // System
  isMobile = false
  themeMode = true
  fabsMenuVisible = false
  rainningCloudVisible = true
  rainningAreaVisible = true
  searchbarVisible = false
  mobileFabsVisible = true
  disabledViewportExtend = false
  CCTVMarkersVisible = true

  setIsMobile = act => this.isMobile = act
  setThemeMode = act => this.themeMode = act
  setFabsMenuVisible = act => this.fabsMenuVisible = act
  setRainningCloudVisible = act => this.rainningCloudVisible = act
  setRainningAreaVisible = act => this.rainningAreaVisible = act
  setSearchbarVisible = act => this.searchbarVisible = act
  setMobileFabsVisible = act => this.mobileFabsVisible = act
  setDisabledViewportExtend = act => this.disabledViewportExtend = act
  setCCTVMarkersVisible = act => this.CCTVMarkersVisible = act

  // map
  map = null
  mapTilesLoaded = false
  userPosition = null
  isMapDragging = false
  currentMapBounds = null
  currentMapZoomedLevel = null
  
  setMap = act => this.map = act
  setMapTilesLoaded = act => this.mapTilesLoaded = act
  setIsMapDragging = act => this.isMapDragging = act
  setUserPosition = act => this.userPosition = act
  setCurrentMapBounds = act => this.currentMapBounds = act
  setCurrentMapZoomedLevel = act => this.currentMapZoomedLevel = act

  // MediaVideo
  videoRef = null
  videoName = null
  videoURL = null

  setVideoRef = act => this.videoRef = act
  setVideoName = act => this.videoName = act
  setVideoURL  = act => {
    fetch(`${this.serverURL}/close`)
    if (act === null) {
      this.videoRef && ( this.videoRef.current.src = null )
      this.videoURL = act
    } 
    this.videoURL = act
  }

}

const store = new Store()
const context = createContext(store)
export const useStore = () => useContext(context)