import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  availableCities = [
    { name: '台北', city: 'Taipei' },
    { name: '新北', city: 'NewTaipei' },
    { name: '基隆', city: 'Keelung' },
    { name: '桃園', city: 'Taoyuan' },
    { name: '苗栗', city: 'MiaoliCounty' },
    { name: '竹北', city: 'HsinchuCounty' },
    { name: '新竹', city: 'Hsinchu' },
    { name: '台中', city: 'Taichung' },
    { name: '南投', city: 'NantouCounty' },
    { name: '彰化', city: 'ChanghuaCounty' },
    { name: '雲林', city: 'YunlinCounty' },
    { name: '嘉義', city: 'Chiayi' },
    { name: '宜蘭', city: 'YilanCounty' },
    { name: '花蓮', city: 'HualienCounty' },
    { name: '台南', city: 'Tainan' },
    { name: '高雄', city: 'Kaohsiung' },
    { name: '台東', city: 'TaitungCounty' },
    { name: '屏東', city: 'PingtungCounty' },
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

  setIsMobile = act => this.isMobile = act
  setThemeMode = act => this.themeMode = act
  setFabsMenuVisible = act => this.fabsMenuVisible = act
  setRainningCloudVisible = act => this.rainningCloudVisible = act
  setRainningAreaVisible = act => this.rainningAreaVisible = act
  setSearchbarVisible = act => this.searchbarVisible = act
  setMobileFabsVisible = act => this.mobileFabsVisible = act

  // map
  map = null
  mapTilesLoaded = false
  isMapDragging = false
  currentMapBounds = null
  currentMapZoomedLevel = null
  
  setMap = act => this.map = act
  setMapTilesLoaded = act => this.mapTilesLoaded = act
  setIsMapDragging = act => this.isMapDragging = act
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
      console.log('connection down')
    } 
    this.videoURL = act
  }

}

const store = new Store()
const context = createContext(store)
export const useStore = () => useContext(context)